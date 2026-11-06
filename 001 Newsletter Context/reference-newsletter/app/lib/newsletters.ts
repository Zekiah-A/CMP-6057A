import "server-only";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireUserId } from "@/app/lib/session";

// Adapted from Lab 4.1 (02-4.1-Prisma-ORM.pdf), pp. 14–18: server-side Prisma read helpers.
// Owner filtering is the brief v4, p. 3 authorship adaptation.
export async function getOwnNewsletters() {
	const authorId = await requireUserId();
	return prisma.newsletter.findMany({ where: { authorId }, orderBy: { updatedAt: "desc" } });
}

export async function getOwnNewsletter(id: string) {
	const authorId = await requireUserId();
	const newsletter = await prisma.newsletter.findFirst({ where: { id, authorId } });
	if (!newsletter) notFound();
	return newsletter;
}
