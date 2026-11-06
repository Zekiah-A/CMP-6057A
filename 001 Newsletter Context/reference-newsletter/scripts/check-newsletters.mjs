import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import pg from "pg";

// Exercise real Server Actions with different sessions, not only hidden UI controls.
execFileSync(process.execPath, ["scripts/check-database.mjs", "--schema"], { stdio: "inherit" });
const baseURL = "http://localhost:3001";
const tag = randomUUID();
const password = "Reference-crud-password-123";
const emails = [`crud-a-${tag}@example.test`, `crud-b-${tag}@example.test`];
const database = new pg.Client({ connectionString: process.env.DATABASE_URL });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", headless: true });
const a = await browser.newContext({ baseURL });
const b = await browser.newContext({ baseURL });
const guest = await browser.newContext({ baseURL });
const pageA = await a.newPage();
const pageB = await b.newPage();
let releaseDelete;

function actionHeaders(request) {
	const original = request.headers();
	return { "next-action": original["next-action"], "content-type": original["content-type"], Origin: baseURL };
}

try {
	await database.connect();
	for (const [index, context] of [a, b].entries()) {
		const response = await context.request.post(`${baseURL}/api/auth/register`, {
			data: { email: emails[index], password, confirmPassword: password }, headers: { Origin: baseURL },
		});
		assert.equal(response.status(), 201);
		const page = index === 0 ? pageA : pageB;
		await page.goto("/login");
		await page.getByLabel("Email", { exact: true }).fill(emails[index]);
		await page.getByLabel("Password", { exact: true }).fill(password);
		await page.getByRole("button", { name: "Log in", exact: true }).click();
		await page.waitForURL("**/dashboard");
	}
	const { rows: users } = await database.query('SELECT id,email FROM "User" WHERE email = ANY($1)', [emails]);
	const userA = users.find(user => user.email === emails[0]);
	const userB = users.find(user => user.email === emails[1]);
	await pageA.getByRole("link", { name: "Create Newsletter", exact: true }).first().click();
	await pageA.setViewportSize({ width: 390, height: 844 });
	await pageA.screenshot({ path: "/tmp/newsletter-reference-create-mobile.png", fullPage: true });
	assert.equal(await pageA.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
	await pageA.setViewportSize({ width: 1280, height: 800 });
	await pageA.getByLabel("Title", { exact: true }).fill(`Private ${tag}`);
	await pageA.getByLabel("Content", { exact: true }).fill("Private content owned by A.");
	await pageA.locator("form").evaluate((form, authorId) => {
		const input = document.createElement("input"); input.name = "authorId"; input.value = authorId; form.append(input);
	}, userB.id);
	await pageA.getByRole("button", { name: "Create newsletter", exact: true }).click();
	await pageA.waitForURL("**/dashboard");
	const { rows: [record] } = await database.query('SELECT * FROM "Newsletter" WHERE "authorId"=$1', [userA.id]);
	assert.ok(record);
	assert.equal(record.status, "Draft");
	assert.equal(record.authorId, userA.id);
	await pageA.getByText("View newsletter", { exact: true }).click();
	await pageA.getByText("Private content owned by A.", { exact: true }).waitFor();
	console.log("PASS: create/view persists Draft and ignores forged authorId.");

	await pageB.reload();
	assert.equal(await pageB.getByText(record.title, { exact: true }).count(), 0);
	const denied = await pageB.goto(`/dashboard/edit/${record.id}`);
	assert.equal(denied.status(), 404);
	assert.equal(await pageB.getByText("Private content owned by A.", { exact: true }).count(), 0);
	console.log("PASS: another account cannot list or load the private record.");

	let updateRequest;
	pageA.on("request", request => { if (request.headers()["next-action"]) updateRequest = request; });
	for (const status of ["Schedule", "Sent", "Draft"]) {
		await pageA.goto(`/dashboard/edit/${record.id}`);
		await pageA.getByLabel("Status", { exact: true }).selectOption(status);
		await pageA.getByRole("button", { name: "Save changes", exact: true }).click();
		await pageA.waitForURL("**/dashboard");
		const { rows: [updated] } = await database.query('SELECT status FROM "Newsletter" WHERE id=$1', [record.id]);
		assert.equal(updated.status, status);
		if (status === "Sent") record.sentRequest = updateRequest;
	}
	assert.ok(record.sentRequest);
	for (const context of [b, guest]) {
		const response = await context.request.post(`${baseURL}/`, { headers: actionHeaders(record.sentRequest), data: record.sentRequest.postDataBuffer(), maxRedirects: 0 });
		if (context === b) {
			assert.equal(response.status(), 200);
			assert.ok((await response.text()).includes("update that newsletter"), "Expected owner-check action error, not an unrelated page response");
		} else {
			// Forwarded anonymous actions can return 200 with an empty result rather than an HTTP redirect.
			// Verify the database remains unchanged below; route redirects are checked by test:auth.
			assert.ok([200, 303, 307].includes(response.status()));
		}
		const { rows: [unchanged] } = await database.query('SELECT status FROM "Newsletter" WHERE id=$1', [record.id]);
		assert.equal(unchanged.status, "Draft");
	}
	console.log("PASS: all statuses persist; replayed updates by another user/guest cannot change data.");

	await pageA.goto(`/dashboard/edit/${record.id}`);
	await pageA.getByLabel("Status", { exact: true }).evaluate(select => {
		select.add(new Option("Invalid", "Invalid")); select.value = "Invalid";
	});
	await pageA.getByRole("button", { name: "Save changes", exact: true }).click();
	await pageA.getByRole("alert").first().waitFor();
	const { rows: [validStatus] } = await database.query('SELECT status FROM "Newsletter" WHERE id=$1', [record.id]);
	assert.equal(validStatus.status, "Draft");
	console.log("PASS: tampered status is rejected server-side.");

	await pageA.goto("/dashboard");
	pageA.once("dialog", dialog => dialog.dismiss());
	await pageA.getByRole("button", { name: "Delete", exact: true }).click();
	assert.equal((await database.query('SELECT id FROM "Newsletter" WHERE id=$1', [record.id])).rowCount, 1);
	let resolveDelete;
	const capturedDelete = new Promise((resolve, reject) => {
		resolveDelete = resolve;
		setTimeout(() => reject(new Error("Delete action request was not captured")), 15000).unref();
	});
	const continueDelete = new Promise(resolve => { releaseDelete = resolve; });
	await pageA.route("**/dashboard", async route => {
		if (route.request().headers()["next-action"]) {
			resolveDelete(route.request());
			await continueDelete;
		}
		await route.continue();
	});
	pageA.once("dialog", dialog => dialog.accept());
	const click = pageA.getByRole("button", { name: "Delete", exact: true }).click();
	const deletion = await capturedDelete;
	for (const context of [b, guest]) {
		const response = await context.request.post(`${baseURL}/`, { headers: actionHeaders(deletion), data: deletion.postDataBuffer(), maxRedirects: 0 });
		if (context === b) {
			assert.equal(response.status(), 200);
			assert.ok((await response.text()).includes("delete that newsletter"), "Expected owner-check action error");
		} else {
			// Forwarded anonymous actions can return 200 with an empty result rather than an HTTP redirect.
			// Verify the database remains unchanged below; route redirects are checked by test:auth.
			assert.ok([200, 303, 307].includes(response.status()));
		}
		assert.equal((await database.query('SELECT id FROM "Newsletter" WHERE id=$1', [record.id])).rowCount, 1);
	}
	releaseDelete();
	await click;
	await pageA.getByText(record.title, { exact: true }).waitFor({ state: "detached" });
	assert.equal((await database.query('SELECT id FROM "Newsletter" WHERE id=$1', [record.id])).rowCount, 0);
	console.log("PASS: delete cancellation, replay isolation and real owner deletion.");
} finally {
	releaseDelete?.();
	const { rows } = await database.query('SELECT id FROM "User" WHERE email = ANY($1)', [emails]).catch(() => ({ rows: [] }));
	const ids = rows.map(row => row.id);
	await database.query('DELETE FROM "Newsletter" WHERE "authorId" = ANY($1)', [ids]).catch(() => {});
	await database.query('DELETE FROM "User" WHERE email = ANY($1)', [emails]).catch(() => {});
	await database.end();
	await browser.close();
}
