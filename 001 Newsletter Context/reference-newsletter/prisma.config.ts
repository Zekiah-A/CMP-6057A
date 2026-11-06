import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const databaseUrl = env("DATABASE_URL");
let url: URL;
try {
	url = new URL(databaseUrl);
} catch {
	throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL.");
}

// New isolation guard for this reference app; not part of Lab 4.1.
// Prisma 7 CLI datasource configuration: https://www.prisma.io/docs/orm/reference/prisma-config-reference
if (
	!["postgres:", "postgresql:"].includes(url.protocol) ||
	!["localhost", "127.0.0.1"].includes(url.hostname) ||
	url.pathname !== "/newsletter_reference" ||
	url.username !== "newsletter_reference_app" ||
	url.searchParams.size !== 0
) {
	throw new Error("DATABASE_URL must use local database newsletter_reference and role newsletter_reference_app, without URL query parameters.");
}

export default defineConfig({
	schema: "prisma/schema.prisma",
	datasource: { url: databaseUrl },
});
