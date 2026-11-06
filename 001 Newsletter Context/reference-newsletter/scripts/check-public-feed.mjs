import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import pg from "pg";

execFileSync(process.execPath, ["scripts/check-database.mjs", "--schema"], { stdio: "inherit" });
const baseURL = "http://localhost:3001";
const tag = randomUUID();
const email = `feed-${tag}@example.test`;
const password = "Reference-feed-password-123";
const database = new pg.Client({ connectionString: process.env.DATABASE_URL });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", headless: true });
const owner = await browser.newContext({ baseURL });
const guest = await browser.newContext({ baseURL });
const page = await owner.newPage();
const publicPage = await guest.newPage();
let userId;
try {
	await database.connect();
	const signup = await owner.request.post(`${baseURL}/api/auth/register`, {
		data: { name: "Feed test author", email, password, confirmPassword: password }, headers: { Origin: baseURL },
	});
	assert.equal(signup.status(), 201);
	const { rows: [user] } = await database.query('SELECT id FROM "User" WHERE email=$1', [email]);
	userId = user.id;
	for (const status of ["Draft", "Schedule", "Sent"]) {
		await database.query('INSERT INTO "Newsletter" (id,title,content,image,status,"authorId","createdAt","updatedAt") VALUES($1,$2,$3,$4,$5,$6,NOW(),NOW())', [
			`${tag}-${status}`, `${status} ${tag}`, status === "Sent" ? "<b>Read this as plain text.</b>" : `Private ${status} content ${tag}`,
			status === "Sent" ? "https://images.example.test/missing.png" : `https://images.example.test/private-${status}.png`, status, userId,
		]);
	}
	await publicPage.route("https://images.example.test/**", route => route.fulfill({ status: 404, body: "No image" }));
	const response = await publicPage.goto("/newsletters");
	assert.equal(response.status(), 200);
	const body = await response.text();
	assert.ok(body.includes(`Sent ${tag}`));
	for (const status of ["Draft", "Schedule"]) {
		assert.ok(!body.includes(`${status} ${tag}`));
		assert.ok(!body.includes(`Private ${status} content ${tag}`));
		assert.ok(!body.includes(`private-${status}.png`));
	}
	assert.ok(!body.includes(email));
	const article = publicPage.getByRole("article").filter({ has: publicPage.getByRole("heading", { name: `Sent ${tag}`, exact: true }) });
	await article.getByText("<b>Read this as plain text.</b>", { exact: true }).waitFor();
	assert.equal(await article.locator("b").count(), 0);
	await article.getByText("Image unavailable", { exact: true }).waitFor();
	assert.ok(!(await guest.cookies()).some(cookie => cookie.name === "newsletter-reference.session-token"));
	console.log("PASS: guest feed excludes private records from the response, exposes no author email, escapes content and handles broken images.");

	await page.goto("/login");
	await page.getByLabel("Email", { exact: true }).fill(email);
	await page.getByLabel("Password", { exact: true }).fill(password);
	await page.getByRole("button", { name: "Log in", exact: true }).click();
	await page.waitForURL("**/dashboard");
	await page.goto(`/dashboard/edit/${tag}-Sent`);
	await page.getByLabel("Status", { exact: true }).selectOption("Draft");
	await page.getByRole("button", { name: "Save changes", exact: true }).click();
	await page.waitForURL("**/dashboard");
	await publicPage.reload();
	assert.equal(await publicPage.getByRole("heading", { name: `Sent ${tag}`, exact: true }).count(), 0);
	await page.goto(`/dashboard/edit/${tag}-Draft`);
	await page.getByLabel("Status", { exact: true }).selectOption("Sent");
	await page.getByLabel("Title", { exact: true }).fill(`Published ${tag}`);
	await page.getByLabel("Content", { exact: true }).fill("New published content.");
	await page.getByLabel("Image URL", { exact: true }).fill("");
	await page.getByRole("button", { name: "Save changes", exact: true }).click();
	await page.waitForURL("**/dashboard");
	await publicPage.reload();
	await publicPage.getByRole("heading", { name: `Published ${tag}`, exact: true }).waitFor();
	await publicPage.getByText("New published content.", { exact: true }).waitFor();
	console.log("PASS: unpublishing removes a record and publishing exposes the current content on refresh.");

	await publicPage.setViewportSize({ width: 390, height: 844 });
	await publicPage.screenshot({ path: "/tmp/newsletter-reference-feed-mobile.png", fullPage: true });
	assert.equal(await publicPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
	page.once("dialog", dialog => dialog.accept());
	const ownCard = page.getByRole("listitem").filter({ has: page.getByRole("heading", { name: `Published ${tag}`, exact: true }) });
	await ownCard.getByRole("button", { name: "Delete", exact: true }).click();
	await page.getByRole("heading", { name: `Published ${tag}`, exact: true }).waitFor({ state: "detached" });
	await publicPage.reload();
	assert.equal(await publicPage.getByRole("heading", { name: `Published ${tag}`, exact: true }).count(), 0);
	console.log("PASS: owner deletion removes published content; mobile feed has no horizontal overflow.");
} finally {
	if (userId) {
		await database.query('DELETE FROM "Newsletter" WHERE "authorId"=$1', [userId]).catch(() => {});
		await database.query('DELETE FROM "User" WHERE id=$1 AND email=$2', [userId, email]).catch(() => {});
	}
	await database.end();
	await browser.close();
}
