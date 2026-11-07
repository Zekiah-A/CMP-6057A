"use client";

import { useState } from "react";
import NewsletterCard from "./NewsletterCard";
import Searchbar from "./Searchbar";
import type { Newsletter } from "@/app/lib/newsletter-types";

type SortOrder = "newest" | "oldest" | "title";

export default function NewsletterFeed({ newsletters }: { newsletters: Newsletter[] }) {
	// Ref: Lab 2.1, 02-2.1.REACT-Typescript-states.pdf pp. 4–10: local state and filtered lists.
	// Filters change supplied public results; the backend must enforce Sent-only reads itself.
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<SortOrder>("newest");
	const [author, setAuthor] = useState("");
	const authors = [...new Set(newsletters.map((newsletter) => newsletter.author))].sort();
	const results = newsletters.filter((newsletter) => {
		const text = `${newsletter.title} ${newsletter.content} ${newsletter.author}`.toLowerCase();
		return (!author || newsletter.author === author) && text.includes(search.trim().toLowerCase());
	}).sort((a, b) => sort === "title"
		? a.title.localeCompare(b.title)
		: (Date.parse(a.updatedAt) - Date.parse(b.updatedAt)) * (sort === "newest" ? -1 : 1));

	return (
		<>
			<section aria-label="Search and filter newsletters" className="flex flex-wrap items-center gap-3">
				<Searchbar value={search} onChange={setSearch} />
				{/* Ref: https://daisyui.com/components/dropdown/#method-2-popover-api-and-anchor-positioning-new
				   Existing popover adapted with date/title ordering and author selection. */}
				<button type="button" className="btn rounded-full" popoverTarget="filter-popover" style={{ anchorName: "--filter-anchor" } as React.CSSProperties}>
					Filters{author || sort !== "newest" ? " •" : ""}
				</button>
				<div popover="auto" id="filter-popover" className="dropdown w-64 max-w-full space-y-3 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm"
					style={{ positionAnchor: "--filter-anchor" } as React.CSSProperties}>
					<label className="flex flex-col gap-2 text-sm font-medium">
						Sort by
						<select className="select w-full" value={sort} onChange={(event) => setSort(event.target.value as SortOrder)}>
							<option value="newest">Newest first</option>
							<option value="oldest">Oldest first</option>
							<option value="title">Title A–Z</option>
						</select>
					</label>
					<label className="flex flex-col gap-2 text-sm font-medium">
						Author
						<select className="select w-full" value={author} onChange={(event) => setAuthor(event.target.value)}>
							<option value="">All authors</option>
							{authors.map((name) => <option key={name} value={name}>{name}</option>)}
						</select>
					</label>
					<button type="button" className="btn btn-sm btn-ghost rounded-full" onClick={() => { setAuthor(""); setSort("newest"); setSearch(""); }}>Reset filters</button>
				</div>
			</section>
			<p role="status" className="text-sm text-base-content/70">{results.length} newsletter{results.length === 1 ? "" : "s"}</p>
			{results.length ? (
				<div className="flex flex-col gap-6">
					{results.map((newsletter) => <NewsletterCard key={newsletter.id} newsletter={newsletter} />)}
				</div>
			) : <p className="rounded-2xl border border-dashed border-base-300 p-6 text-center">No newsletters match your search. Try another search or reset the filters.</p>}
		</>
	);
}
