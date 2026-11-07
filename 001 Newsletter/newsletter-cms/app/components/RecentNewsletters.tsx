"use client";

import Link from "next/link";
import { useState } from "react";
import NewsletterCard from "./NewsletterCard";
import type { Newsletter } from "@/app/lib/newsletter-types";

// Ref: https://daisyui.com/components/stack/ Overlapping cards, newest first.
// Ref: Lab 2.1, 02-2.1.REACT-Typescript-states.pdf pp. 4–10: local state/list filtering.
// Dismissal only removes a card from this view; it never deletes the newsletter.
export default function RecentNewsletters({ newsletters }: { newsletters: Newsletter[] }) {
	const [dismissed, setDismissed] = useState<string[]>([]);
	const remaining = newsletters.slice(0, 5).filter((newsletter) => !dismissed.includes(newsletter.id));

	return (
		<div className="space-y-4">
			{remaining.length ? (
				<div className="stack w-full">
					{remaining.map((newsletter, index) => (
						// Covered cards must not receive keyboard focus or duplicate screen reader content.
						<div key={newsletter.id} className="flex" inert={index > 0} aria-hidden={index > 0}>
							<NewsletterCard newsletter={newsletter} compact />
						</div>
					))}
				</div>
			) : <p className="rounded-2xl border border-base-300 bg-base-100 p-6">All caught up.</p>}
			<div className="flex flex-wrap items-center gap-3">
				{remaining.length > 0 && <button type="button" className="btn rounded-full"
					onClick={() => setDismissed((current) => [...current, remaining[0].id])}>Dismiss</button>}
				<Link href="/newsletters" className="btn btn-ghost rounded-full">View all newsletters</Link>
				<p role="status" className="text-sm text-base-content/70">{remaining.length} recent newsletter{remaining.length === 1 ? "" : "s"} remaining</p>
			</div>
		</div>
	);
}
