import Link from "next/link";
import NewsletterImage from "./NewsletterImage";
import { formatNewsletterDate, type Newsletter } from "@/app/lib/newsletter-types";

type NewsletterCardProps = {
	newsletter: Newsletter;
	compact?: boolean;
};

// Ref: Lab 3.1, 02-3.1.Next-continue-RTK.pdf pp. 3–8: newsletter props and mapped cards.
// Ref: https://daisyui.com/components/card/ Card content adapted to the newsletter fields.
export default function NewsletterCard({ newsletter, compact = false }: NewsletterCardProps) {
	return (
		<article id={newsletter.id} className="card w-full min-w-0 border border-base-300 bg-base-100 shadow-sm scroll-mt-4">
			{newsletter.image && <NewsletterImage key={newsletter.image} src={newsletter.image} />}
			<div className="card-body gap-3 p-6">
				<h2 className="card-title break-words text-xl">{newsletter.title}</h2>
				<p className="text-sm text-base-content/70">
					{newsletter.author} · <time dateTime={newsletter.updatedAt}>{formatNewsletterDate(newsletter.updatedAt)}</time>
				</p>
				<p className={`whitespace-pre-wrap break-words${compact ? " line-clamp-3" : ""}`}>{newsletter.content}</p>
				{compact && <div className="card-actions mt-2">
					<Link href={`/newsletters#${newsletter.id}`} className="btn btn-sm rounded-full">Read newsletter</Link>
				</div>}
			</div>
		</article>
	);
}
