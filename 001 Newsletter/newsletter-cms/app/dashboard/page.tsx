"use client";

import Link from "next/link";
import { useState } from "react";
import DeleteNewsletterButton from "@/app/components/DeleteNewsletterButton";
import Searchbar from "@/app/components/Searchbar";
import { useNewsletterWorkspace } from "@/app/components/NewsletterWorkspace";
import { newsletterStatuses, formatNewsletterDate } from "@/app/lib/newsletter-types";

export default function DashboardPage() {
	const { newsletters } = useNewsletterWorkspace();
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("");
	const results = newsletters.filter((newsletter) => (!status || newsletter.status === status)
		&& `${newsletter.title} ${newsletter.content}`.toLowerCase().includes(search.trim().toLowerCase()))
		.toSorted((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

	return (
		<>
			<section className="flex flex-wrap items-end justify-between gap-4">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold sm:text-4xl">Dashboard</h1>
					<p className="text-base-content/70">Create and manage your newsletters.</p>
				</div>
				<Link href="/dashboard/create" className="btn btn-neutral rounded-full">Create Newsletter</Link>
			</section>
			<section aria-label="Find your newsletters" className="flex flex-wrap items-center gap-3">
				<Searchbar value={search} onChange={setSearch} />
				<select aria-label="Filter by status" className="select w-full sm:w-48" value={status} onChange={(event) => setStatus(event.target.value)}>
					<option value="">All statuses</option>
					{newsletterStatuses.map((value) => <option key={value} value={value}>{value}</option>)}
				</select>
			</section>
			<p role="status" className="text-sm text-base-content/70">{results.length} newsletter{results.length === 1 ? "" : "s"}</p>
			{results.length ? (
				<ul className="space-y-6">
					{results.map((newsletter) => (
						<li key={newsletter.id} className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div className="min-w-0 space-y-2">
									<h2 className="break-words text-xl font-semibold"><Link className="link link-hover" href={`/dashboard/view/${newsletter.id}`}>{newsletter.title}</Link></h2>
									<div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
										<span className="badge badge-outline">{newsletter.status}</span>
										<time dateTime={newsletter.updatedAt}>Updated {formatNewsletterDate(newsletter.updatedAt)}</time>
									</div>
								</div>
								<div className="flex flex-wrap gap-2">
									<Link href={`/dashboard/view/${newsletter.id}`} className="btn btn-sm btn-outline rounded-full">View</Link>
									<Link href={`/dashboard/edit/${newsletter.id}`} className="btn btn-sm btn-outline rounded-full">Edit</Link>
									<DeleteNewsletterButton id={newsletter.id} />
								</div>
							</div>
							<p className="mt-4 line-clamp-2 whitespace-pre-wrap break-words text-base-content/70">{newsletter.content}</p>
						</li>
					))}
				</ul>
			) : (
				<div className="space-y-3 rounded-2xl border border-dashed border-base-300 p-6 text-center">
					<h2 className="text-xl font-semibold">{newsletters.length ? "No matching newsletters" : "No newsletters yet"}</h2>
					<p className="text-base-content/70">{newsletters.length ? "Try another search or choose All statuses." : "Create your first newsletter to get started."}</p>
				</div>
			)}
		</>
	);
}
