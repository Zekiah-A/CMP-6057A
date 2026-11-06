import Link from "next/link";

export default function HomePage() {
	return (
		<section className="space-y-5">
			<p className="badge badge-outline">AI-generated reference · Slice 2</p>
			<h1 className="text-3xl font-bold">Newsletter CMS</h1>
			<p>Account registration, credential login and protected dashboard routes are available in this learning reference.</p>
			<p>Newsletter listing, creation, editing and publication are planned for later slices.</p>
			<div className="flex items-center gap-3">
				<Link href="/register" className="btn btn-neutral">Create an account</Link>
				<Link href="/newsletters" className="btn btn-ghost">Browse newsletters</Link>
			</div>
		</section>
	);
}
