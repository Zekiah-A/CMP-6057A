import Link from "next/link";

export default function HomePage() {
	return (
		<section className="space-y-5">
			<p className="badge badge-outline">AI-generated reference · Slice 3</p>
			<h1 className="text-3xl font-bold">Newsletter CMS</h1>
			<p>Register or log in to create and manage your own newsletters.</p>
			<p>Author-owned listing, creation, editing and deletion are available. The public Sent newsletter feed is planned for the next slice.</p>
			<div className="flex flex-wrap items-center gap-3">
				<Link href="/register" className="btn btn-neutral">Create an account</Link>
				<Link href="/newsletters" className="btn btn-ghost">Browse newsletters</Link>
				<Link href="/dashboard" className="btn btn-outline">Open dashboard</Link>
			</div>
		</section>
	);
}
