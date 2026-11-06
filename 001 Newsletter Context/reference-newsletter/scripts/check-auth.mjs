import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import pg from "pg";
import { encode } from "next-auth/jwt";

// Integration checks against the isolated reference only; never reset a database.
execFileSync(process.execPath, ["scripts/check-database.mjs"], { stdio: "inherit" });
const baseURL = "http://localhost:3001";
const email = `auth-check-${randomUUID()}@example.test`;
const password = "Reference-test-password-123";
const database = new pg.Client({ connectionString: process.env.DATABASE_URL });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", headless: true });
const context = await browser.newContext({ baseURL });
const page = await context.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));

try {
	await database.connect();
	for (const path of ["/dashboard", "/dashboard/create", "/dashboard/edit/example"]) {
		await page.goto(path);
		assert.equal(new URL(page.url()).pathname, "/login");
	}
	console.log("PASS: guests denied every dashboard page.");

	let response = await context.request.post(`${baseURL}/api/auth/register`, {
		data: { email, password, confirmPassword: password },
		headers: { Origin: "https://untrusted.example" },
	});
	assert.equal(response.status(), 403);
	response = await context.request.post(`${baseURL}/api/auth/register`, {
		data: { email, password: "short", confirmPassword: "short" },
		headers: { Origin: baseURL },
	});
	assert.equal(response.status(), 400);
	response = await context.request.post(`${baseURL}/api/auth/register`, {
		data: { email, password: "界".repeat(30), confirmPassword: "界".repeat(30) },
		headers: { Origin: baseURL },
	});
	assert.equal(response.status(), 400);
	console.log("PASS: registration origin, password policy and UTF-8 byte limit.");

	await page.goto("/register");
	await page.getByLabel("Email", { exact: true }).fill(email);
	await page.getByLabel("Password", { exact: true }).fill(password);
	await page.getByLabel("Confirm password", { exact: true }).fill(password);
	await page.getByRole("button", { name: "Create account", exact: true }).click();
	await page.waitForURL("**/login?registered=1");
	const { rows: [user] } = await database.query('SELECT id, name, password FROM "User" WHERE email = $1', [email]);
	assert.ok(user);
	assert.equal(user.name, null);
	assert.match(user.password, /^\$2[aby]\$/);
	assert.notEqual(user.password, password);
	response = await context.request.post(`${baseURL}/api/auth/register`, {
		data: { email: email.toUpperCase(), password, confirmPassword: password },
		headers: { Origin: baseURL },
	});
	assert.equal(response.status(), 409);
	console.log("PASS: optional-name signup UI, password hash and normalised duplicate email.");
	for (let attempt = 0; attempt < 3; attempt++) {
		response = await context.request.post(`${baseURL}/api/auth/register`, {
			data: { email, password, confirmPassword: password }, headers: { Origin: baseURL },
		});
		assert.equal(response.status(), 409);
	}
	response = await context.request.post(`${baseURL}/api/auth/register`, {
		data: { email, password, confirmPassword: password }, headers: { Origin: baseURL },
	});
	assert.equal(response.status(), 429);
	console.log("PASS: repeated registration is throttled.");

	await page.getByLabel("Email", { exact: true }).fill(email);
	await page.getByLabel("Password", { exact: true }).fill("Wrong-password-123");
	await page.getByRole("button", { name: "Log in", exact: true }).click();
	await page.getByRole("alert").waitFor();
	assert.equal(new URL(page.url()).pathname, "/login");
	await page.getByLabel("Password", { exact: true }).fill(password);
	await page.getByRole("button", { name: "Log in", exact: true }).click();
	await page.waitForURL("**/dashboard");
	await page.reload();
	assert.equal(new URL(page.url()).pathname, "/dashboard");
	const session = await (await context.request.get(`${baseURL}/api/auth/session`)).json();
	assert.equal(session.user.id, user.id);
	assert.equal(session.user.password, undefined);
	const cookie = (await context.cookies()).find(value => value.name === "newsletter-reference.session-token");
	assert.ok(cookie?.httpOnly);
	assert.equal(cookie.sameSite, "Lax");
	console.log("PASS: failed/successful login, reload, safe session identity and HttpOnly cookie.");

	const forged = await browser.newContext({ baseURL });
	await forged.addCookies([{ ...cookie, value: "forged-session-value" }]);
	const forgedPage = await forged.newPage();
	await forgedPage.goto("/dashboard");
	assert.equal(new URL(forgedPage.url()).pathname, "/login");
	const expiredToken = await encode({
		secret: process.env.AUTH_SECRET,
		salt: cookie.name,
		token: { id: user.id, sub: user.id, email },
		maxAge: -3600,
	});
	await forged.addCookies([{ ...cookie, value: expiredToken }]);
	await forgedPage.goto("/dashboard");
	assert.equal(new URL(forgedPage.url()).pathname, "/login");
	await forged.close();
	console.log("PASS: forged and expired session tokens cannot grant access.");

	await page.getByText(email, { exact: true }).click();
	await page.getByRole("button", { name: "Log out", exact: true }).click();
	await page.waitForURL("**/login");
	assert.ok(!(await context.cookies()).some(value => value.name === cookie.name));
	await page.goto("/dashboard");
	assert.equal(new URL(page.url()).pathname, "/login");
	console.log("PASS: logout clears the session and dashboard access.");

	await context.addCookies([cookie]);
	await database.query('DELETE FROM "User" WHERE id = $1 AND email = $2', [user.id, email]);
	await page.goto("/dashboard");
	assert.equal(new URL(page.url()).pathname, "/login");
	console.log("PASS: a deleted user cannot use a previously valid cookie.");
	assert.deepEqual(errors, []);
	console.log("PASS: no browser runtime errors.");
} finally {
	await database.query('DELETE FROM "User" WHERE email = $1', [email]).catch(() => {});
	await database.end();
	await browser.close();
}
