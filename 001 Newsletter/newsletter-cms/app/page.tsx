import Link from "next/link";
import NewsletterCard from "./components/NewsletterCard";
import { publicNewsletters } from "./lib/preview-newsletters";

type HomeProps = {
	user?: { name?: string | null; email?: string | null } | null;
};

function HomeContent({ user = null }: HomeProps) {
	const recent = publicNewsletters.filter((newsletter) => newsletter.status === "Sent")
		.toSorted((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 3);

	return (
		<>
			<section className="space-y-2">
				<h1 className="text-3xl font-bold sm:text-4xl">Simple Newsletter CMS</h1>
				<p className="text-base-content/70">Create an account to write, edit and manage your newsletters, or view sent newsletters in the public feed.</p>
			</section>
			<section aria-labelledby="quick-actions" className="space-y-4">
				<h2 id="quick-actions" className="text-2xl font-semibold">Quick Actions</h2>
				<div className="flex flex-wrap gap-3">
					{/* This link shows for everyone - Zekiah */}
					<Link className="btn rounded-full" href="/newsletters">Browse newsletters</Link>
					{/* Links change based on auth state - Zekiah */}
					{user ? <>
						<Link className="btn rounded-full" href="/dashboard/create">Create newsletter</Link>
						<Link className="btn rounded-full" href="/dashboard">Manage newsletters</Link>
					</> : <Link className="btn rounded-full" href="/register">Create Account</Link>}
				</div>
			</section>
			<section aria-labelledby="recent-posts" className="space-y-6">
				<h2 id="recent-posts" className="text-2xl font-semibold">Recent Posts</h2>
				{/* Ref: Lab 3.1 pp. 3–8: mapped newsletter cards. Vertical stack keeps every post readable. */}
				<div className="flex flex-col gap-6">
					{recent.map((newsletter) => <NewsletterCard key={newsletter.id} newsletter={newsletter} compact />)}
				</div>
			</section>
		</>
	);
}

export default function Home() {
	// Backend: read the verified Auth.js session here and pass its user to HomeContent.
	return <HomeContent user={null} />;
}
