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

// Brief v4, p. 3: the public feed contains Sent newsletters only. Lab 4.1
// (02-4.1-Prisma-ORM.pdf), pp. 14–18: server-side Prisma reads adapted here.
export async function getPublicNewsletters() {
	return prisma.newsletter.findMany({
		where: { status: "Sent" },
		select: {
			id: true,
			title: true,
			content: true,
			image: true,
			updatedAt: true,
			author: { select: { name: true } },
		},
		orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
	});
}
