import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

function createPrismaClient() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) throw new Error("DATABASE_URL is required.");
	let url: URL;
	try {
		url = new URL(databaseUrl);
	} catch {
		throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL.");
	}

	// New isolation guard for the reference app, also enforced in prisma.config.ts.
	if (
		!["postgres:", "postgresql:"].includes(url.protocol) ||
		!["localhost", "127.0.0.1"].includes(url.hostname) ||
		url.pathname !== "/newsletter_reference" ||
		url.username !== "newsletter_reference_app" ||
		url.searchParams.size !== 0
	) {
		throw new Error("DATABASE_URL must use local database newsletter_reference and role newsletter_reference_app, without URL query parameters.");
	}

	return new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
}

// Adapted from Lab 4.1 (02-4.1-Prisma-ORM.pdf), pp. 4–8:
// PostgreSQL adapter and a global singleton prevent extra clients during hot reload.
// Prisma 7 custom generated output and isolation guard are new adaptations.
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-management
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
