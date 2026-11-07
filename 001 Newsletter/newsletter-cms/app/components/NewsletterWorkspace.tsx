"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { workspaceNewsletters } from "@/app/lib/preview-newsletters";
import type { Newsletter, NewsletterFields } from "@/app/lib/newsletter-types";

type NewsletterWorkspaceValue = {
	newsletters: Newsletter[];
	createNewsletter: (fields: NewsletterFields) => string;
	updateNewsletter: (id: string, fields: NewsletterFields) => void;
	deleteNewsletter: (id: string) => void;
};

const NewsletterWorkspaceContext = createContext<NewsletterWorkspaceValue | null>(null);

// Ref: Lab 2.1, 02-2.1.REACT-Typescript-states.pdf pp. 4–10: React state and list filtering.
// The create/update/delete state helpers below are newsletter-specific adaptations.
// Temporary frontend state shared across dashboard routes, reset on a full reload.
// Backend: replace with Lab 4.1 pp. 14–18 server reads/actions plus session/owner checks.
// Client state and the author below provide NO authentication or ownership enforcement.
export default function NewsletterWorkspace({ children }: { children: ReactNode }) {
	const [newsletters, setNewsletters] = useState<Newsletter[]>(workspaceNewsletters);

	function createNewsletter(fields: NewsletterFields) {
		const id = crypto.randomUUID();
		const now = new Date().toISOString();
		setNewsletters((current) => [{ ...fields, id, author: "Newsletter team", createdAt: now, updatedAt: now }, ...current]);
		return id;
	}

	function updateNewsletter(id: string, fields: NewsletterFields) {
		setNewsletters((current) => current.map((newsletter) => newsletter.id === id
			? { ...newsletter, ...fields, updatedAt: new Date().toISOString() } : newsletter));
	}

	function deleteNewsletter(id: string) {
		setNewsletters((current) => current.filter((newsletter) => newsletter.id !== id));
	}

	return (
		<NewsletterWorkspaceContext.Provider value={{ newsletters, createNewsletter, updateNewsletter, deleteNewsletter }}>
			{children}
		</NewsletterWorkspaceContext.Provider>
	);
}

export function useNewsletterWorkspace() {
	const workspace = useContext(NewsletterWorkspaceContext);
	if (!workspace) throw new Error("Newsletter workspace must be used within the dashboard layout.");
	return workspace;
}
