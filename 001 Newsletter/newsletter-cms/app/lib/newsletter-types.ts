export const newsletterStatuses = ["Draft", "Schedule", "Sent"] as const;
export type NewsletterStatus = typeof newsletterStatuses[number];

export type NewsletterFields = {
	title: string;
	content: string;
	image: string;
	status: NewsletterStatus;
};

export type Newsletter = NewsletterFields & {
	id: string;
	author: string;
	createdAt: string;
	updatedAt: string;
};

export function formatNewsletterDate(value: string) {
	return new Date(value).toLocaleDateString("en-GB", {
		day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
	});
}
