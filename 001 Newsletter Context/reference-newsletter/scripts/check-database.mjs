import "dotenv/config";
import pg from "pg";

// New read-only isolation check, run before db:push. Not part of Lab 4.1.
// Connection API: https://node-postgres.com/apis/client
async function checkDatabase() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) throw new Error("DATABASE_URL is required.");
	let url;
	try {
		url = new URL(databaseUrl);
	} catch {
		throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL.");
	}
	if (
		!["postgres:", "postgresql:"].includes(url.protocol) ||
		!["localhost", "127.0.0.1"].includes(url.hostname) ||
		url.pathname !== "/newsletter_reference" ||
		url.username !== "newsletter_reference_app" ||
		url.searchParams.size !== 0
	) {
		throw new Error("Refusing database access: expected local newsletter_reference database and newsletter_reference_app role, without URL query parameters.");
	}

	const client = new pg.Client({ connectionString: databaseUrl, connectionTimeoutMillis: 5000 });
	try {
		await client.connect();
		const { rows: [identity] } = await client.query("SELECT current_database() AS database, current_user AS role");
		if (identity.database !== "newsletter_reference" || identity.role !== "newsletter_reference_app") {
			throw new Error("Connected database or role does not match the reference app.");
		}
		console.log("Verified local database newsletter_reference as newsletter_reference_app.");

		if (process.argv.includes("--schema")) {
			const { rows: [tables] } = await client.query(`
				SELECT to_regclass('public."User"') IS NOT NULL AS users,
				       to_regclass('public."Newsletter"') IS NOT NULL AS newsletters
			`);
			if (!tables.users || !tables.newsletters) throw new Error("Expected User and Newsletter tables are missing.");
			const { rows } = await client.query(`
				SELECT 1 FROM pg_constraint
				WHERE contype = 'f'
				  AND conrelid = 'public."Newsletter"'::regclass
				  AND confrelid = 'public."User"'::regclass
				  AND pg_get_constraintdef(oid) LIKE 'FOREIGN KEY ("authorId") REFERENCES%'
			`);
			if (rows.length !== 1) throw new Error("Expected Newsletter.authorId foreign key is missing.");
			console.log("Verified User, Newsletter, and the author foreign key.");
		}
	} finally {
		await client.end();
	}
}

checkDatabase().catch(() => {
	// Avoid logging driver errors: they may contain connection details or credentials.
	console.error("Database check failed. Verify the local reference role, credentials, database, and requested schema.");
	process.exitCode = 1;
});
