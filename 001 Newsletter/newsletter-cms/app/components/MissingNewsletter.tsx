import Link from "next/link";

export default function MissingNewsletter() {
	return (
		<section className="space-y-4 rounded-2xl border border-base-300 bg-base-100 p-6">
			<h1 className="text-3xl font-bold sm:text-4xl">Newsletter not found</h1>
			<p className="text-base-content/70">This newsletter is no longer available.</p>
			<Link className="btn rounded-full" href="/dashboard">Back to dashboard</Link>
		</section>
	);
}
