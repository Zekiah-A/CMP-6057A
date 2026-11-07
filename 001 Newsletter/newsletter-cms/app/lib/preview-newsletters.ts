import type { Newsletter } from "./newsletter-types";

// Ref: Lab 3.1, 02-3.1.Next-continue-RTK.pdf pp. 3–8: typed static newsletter data.
// Frontend fixtures, not database results. Replace the public read with a server-side
// Sent-only Prisma query (brief v4 p. 3); never send private rows to the browser.
export const publicNewsletters: Newsletter[] = [
	{
		id: "welcome", title: "Welcome to the newsletter",
		content: "A place to share updates, ideas and stories. Browse the latest newsletters and find something new to read.",
		image: "", status: "Sent", author: "Newsletter team",
		createdAt: "2026-11-06T10:00:00Z", updatedAt: "2026-11-06T10:00:00Z",
	},
	{
		id: "weekly-roundup", title: "This week's roundup",
		content: "A look back at the week, with useful links and a few ideas for what comes next. Take a moment to catch up.",
		image: "", status: "Sent", author: "Community desk",
		createdAt: "2026-11-05T10:00:00Z", updatedAt: "2026-11-05T10:00:00Z",
	},
	{
		id: "getting-started", title: "Getting started with newsletters",
		content: "Start with a title, write your message and choose a status. Keep a draft while you work, then publish when you are ready.",
		image: "", status: "Sent", author: "Newsletter team",
		createdAt: "2026-11-04T10:00:00Z", updatedAt: "2026-11-04T10:00:00Z",
	},
];

// Separate workspace fixtures: not an authenticated author's records.
export const workspaceNewsletters: Newsletter[] = [
	publicNewsletters[0],
	{
		id: "next-edition", title: "Ideas for the next edition",
		content: "Notes and ideas for the next newsletter.", image: "", status: "Draft",
		author: "Newsletter team", createdAt: "2026-11-05T12:00:00Z", updatedAt: "2026-11-06T12:00:00Z",
	},
	{
		id: "upcoming-update", title: "An upcoming update",
		content: "A newsletter prepared for a future update.", image: "", status: "Schedule",
		author: "Newsletter team", createdAt: "2026-11-05T09:00:00Z", updatedAt: "2026-11-05T09:00:00Z",
	},
];
