import NewsletterFeed from "../components/NewsletterFeed";
import { publicNewsletters } from "../lib/preview-newsletters";

export default function NewslettersPage() {
	return (
		<>
			<section className="space-y-2">
				<h1 className="text-3xl font-bold sm:text-4xl">Newsletters</h1>
				<p className="text-base-content/70">Search and view all published newsletters in the global feed.</p>
			</section>
			{/* Brief v4 p. 3: public content is Sent only. Replace fixtures with a filtered server read. */}
			<NewsletterFeed newsletters={publicNewsletters.filter((newsletter) => newsletter.status === "Sent")} />
		</>
	);
}
