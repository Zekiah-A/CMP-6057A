"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireUserId } from "@/app/lib/session";
import { validateNewsletterForm, type NewsletterState } from "@/app/lib/newsletter-validation";

// Adapted from Lab 4.1 (02-4.1-Prisma-ORM.pdf), pp. 14–18: server actions perform Prisma CRUD and revalidate after writes.
// Session-derived authorship and owner predicates adapt the ownership requirement in brief v4, p. 3.
function validId(id: string) {
	return typeof id === "string" && id.length > 0 && id.length <= 64 && /^[a-zA-Z0-9_-]+$/.test(id);
}

function refreshNewsletterPages() {
	revalidatePath("/dashboard");
	revalidatePath("/newsletters");
}

export async function createNewsletter(_previous: NewsletterState, formData: FormData): Promise<NewsletterState> {
	const authorId = await requireUserId();
	const validation = validateNewsletterForm(formData, true);
	if (!validation.success) return validation.state;
	try {
		await prisma.newsletter.create({ data: { ...validation.data, authorId } });
	} catch {
		return { error: "We couldn't save the newsletter. Please try again." };
	}
	refreshNewsletterPages();
	redirect("/dashboard");
}

export async function updateNewsletter(id: string, _previous: NewsletterState, formData: FormData): Promise<NewsletterState> {
	const authorId = await requireUserId();
	if (!validId(id)) return { error: "We couldn't update that newsletter." };
	const validation = validateNewsletterForm(formData);
	if (!validation.success) return validation.state;
	try {
		const result = await prisma.newsletter.updateMany({ where: { id, authorId }, data: validation.data });
		if (result.count !== 1) return { error: "We couldn't update that newsletter." };
	} catch {
		return { error: "We couldn't update that newsletter. Please try again." };
	}
	refreshNewsletterPages();
	redirect("/dashboard");
}

export async function deleteNewsletter(id: string): Promise<NewsletterState> {
	const authorId = await requireUserId();
	if (!validId(id)) return { error: "We couldn't delete that newsletter." };
	try {
		const result = await prisma.newsletter.deleteMany({ where: { id, authorId } });
		if (result.count !== 1) return { error: "We couldn't delete that newsletter." };
	} catch {
		return { error: "We couldn't delete that newsletter. Please try again." };
	}
	refreshNewsletterPages();
	redirect("/dashboard");
}
