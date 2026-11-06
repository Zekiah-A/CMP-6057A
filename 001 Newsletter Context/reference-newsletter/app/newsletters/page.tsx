import NewsletterImage from "@/app/components/NewsletterImage";
import { getPublicNewsletters } from "@/app/lib/newsletters";

export const dynamic = "force-dynamic";

// Brief v4, p. 3: public Sent-only feed. Lab 3.1, pp. 3–8: newsletter
// display adapted to a public card feed; full provenance is listed in README.md.
export default async function NewslettersPage() {
	const newsletters = await getPublicNewsletters();

	return (
		<section className="space-y-6">
			<div className="space-y-2">
				<p className="badge badge-outline">Public feed · Sent newsletters</p>
				<h1 className="text-3xl font-bold">Newsletters</h1>
				<p>Published newsletters, available to everyone.</p>
			</div>

			{newsletters.length === 0 ? (
				<div className="rounded-box border border-base-300 bg-base-200 p-6">
					<h2 className="text-xl font-semibold">No newsletters published yet</h2>
					<p className="mt-2">Check back later for new newsletters.</p>
				</div>
			) : (
				<div className="space-y-6">
					{newsletters.map((newsletter) => (
						<article key={newsletter.id} className="overflow-hidden rounded-box border border-base-300 bg-base-200">
							<NewsletterImage src={newsletter.image} title={newsletter.title} />
							<div className="space-y-4 p-5 sm:p-6">
								<div className="space-y-2">
									<div className="flex flex-wrap items-center gap-2">
										<span className="badge badge-success badge-outline">Sent</span>
										<time className="text-sm text-base-content/70" dateTime={newsletter.updatedAt.toISOString()}>
											{newsletter.updatedAt.toLocaleDateString("en-GB", { dateStyle: "long", timeZone: "UTC" })}
										</time>
									</div>
									<h2 className="break-words text-2xl font-bold">{newsletter.title}</h2>
									<p className="break-words text-sm text-base-content/70">By {newsletter.author.name || "Newsletter author"}</p>
								</div>
								<div className="whitespace-pre-wrap break-words leading-relaxed">{newsletter.content}</div>
							</div>
						</article>
					))}
				</div>
			)}
		</section>
	);
}
