"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import NewsletterForm from "@/app/components/NewsletterForm";
import MissingNewsletter from "@/app/components/MissingNewsletter";
import { useNewsletterWorkspace } from "@/app/components/NewsletterWorkspace";
import type { NewsletterFields } from "@/app/lib/newsletter-types";

// Ref: Lab 3.1 pp. 3–8: newsletter lookup by dynamic route id, adapted to client fixtures.
// Backend: replace this lookup with an owner-scoped server read and notFound().
export default function EditNewsletterPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const { newsletters, updateNewsletter } = useNewsletterWorkspace();
	const router = useRouter();
	const newsletter = newsletters.find((item) => item.id === id);
	if (!newsletter) return <MissingNewsletter />;

	function handleSave(fields: NewsletterFields) {
		updateNewsletter(id, fields);
		router.push(`/dashboard/view/${id}`);
	}

	return (
		<section className="mx-auto w-full max-w-2xl space-y-6">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold sm:text-4xl">Edit newsletter</h1>
				<p className="text-base-content/70">Update this newsletter’s details and status.</p>
			</div>
			<NewsletterForm key={id} onSave={handleSave} initial={newsletter} />
		</section>
	);
}
