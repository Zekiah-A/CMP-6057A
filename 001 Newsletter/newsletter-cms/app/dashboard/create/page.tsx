"use client";

import { useRouter } from "next/navigation";
import NewsletterForm from "@/app/components/NewsletterForm";
import { useNewsletterWorkspace } from "@/app/components/NewsletterWorkspace";
import type { NewsletterFields } from "@/app/lib/newsletter-types";

export default function CreateNewsletterPage() {
	const { createNewsletter } = useNewsletterWorkspace();
	const router = useRouter();

	function handleSave(fields: NewsletterFields) {
		const id = createNewsletter(fields);
		router.push(`/dashboard/view/${id}`);
	}

	return (
		<section className="mx-auto w-full max-w-2xl space-y-6">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold sm:text-4xl">Create newsletter</h1>
				<p className="text-base-content/70">Add the details and choose a status for your newsletter.</p>
			</div>
			<NewsletterForm onSave={handleSave} />
		</section>
	);
}
