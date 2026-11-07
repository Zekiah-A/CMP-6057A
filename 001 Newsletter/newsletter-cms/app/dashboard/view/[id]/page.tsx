"use client";

import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import DeleteNewsletterButton from "@/app/components/DeleteNewsletterButton";
import MissingNewsletter from "@/app/components/MissingNewsletter";
import NewsletterCard from "@/app/components/NewsletterCard";
import { useNewsletterWorkspace } from "@/app/components/NewsletterWorkspace";

// Ref: Lab 3.1, 02-3.1.Next-continue-RTK.pdf pp. 3–8: dynamic newsletter detail page.
export default function ViewNewsletterPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const { newsletters } = useNewsletterWorkspace();
	const router = useRouter();
	const newsletter = newsletters.find((item) => item.id === id);
	if (!newsletter) return <MissingNewsletter />;

	return (
		<section className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<Link className="btn btn-ghost rounded-full" href="/dashboard">Back to dashboard</Link>
				<div className="flex flex-wrap items-center gap-2">
					<span className="badge badge-outline">{newsletter.status}</span>
					<Link className="btn btn-sm btn-outline rounded-full" href={`/dashboard/edit/${id}`}>Edit</Link>
					<DeleteNewsletterButton id={id} onDeleted={() => router.push("/dashboard")} />
				</div>
			</div>
			<h1 className="text-3xl font-bold sm:text-4xl">View newsletter</h1>
			<NewsletterCard newsletter={newsletter} />
		</section>
	);
}
