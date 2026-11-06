import { z } from "zod";

// Adapted from Week 4 lecture (01-4-web-security-auth0-PrismaORM-v3.pdf), pp. 59–64: Zod validation returns field-level feedback for useActionState.
// Status values come from brief v4, p. 3. Length/URL limits are reference design choices, not rubric rules.
export type NewsletterState = {
	error?: string;
	errors?: Partial<Record<"title" | "content" | "image" | "status", string>>;
};

const httpUrl = z.string().max(2048).refine((value) => {
	try {
		const url = new URL(value);
		return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
	} catch {
		return false;
	}
}, "Enter a valid HTTP(S) URL without credentials.");

export const newsletterSchema = z.object({
	title: z.string().trim().min(1, "Enter a title.").max(200, "Title must be 200 characters or fewer."),
	content: z.string().min(1, "Enter newsletter content.").max(20000, "Content must be 20,000 characters or fewer.").refine((value) => value.trim().length > 0, "Enter newsletter content."),
	image: z.union([z.literal(""), httpUrl]),
	status: z.enum(["Draft", "Schedule", "Sent"]),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export function validateNewsletterForm(formData: FormData, isCreate = false) {
	const rawStatus = formData.get("status");
	const parsed = newsletterSchema.safeParse({
		title: formData.get("title"),
		content: formData.get("content"),
		image: formData.get("image") ?? "",
		status: rawStatus === null && isCreate ? "Draft" : rawStatus,
	});
	if (parsed.success) return { success: true as const, data: parsed.data };
	const errors: NonNullable<NewsletterState["errors"]> = {};
	for (const issue of parsed.error.issues) {
		const field = issue.path[0];
		if ((field === "title" || field === "content" || field === "image" || field === "status") && !errors[field]) errors[field] = issue.message;
	}
	return { success: false as const, state: { errors } };
}
