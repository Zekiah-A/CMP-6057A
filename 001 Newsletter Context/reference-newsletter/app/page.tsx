import Link from "next/link";

export default function HomePage() {
	return (
		<section className="space-y-5">
			<p className="badge badge-outline">AI-generated reference · Minimum-requirements learning MVP</p>
			<h1 className="text-3xl font-bold">Newsletter CMS</h1>
			<p>Create an account to write, edit and manage your newsletters. Newsletters marked Sent appear in the public feed.</p>
			<div className="flex flex-wrap items-center gap-3">
				<Link href="/register" className="btn btn-neutral">Create an account</Link>
				<Link href="/newsletters" className="btn btn-ghost">Browse newsletters</Link>
			</div>
		</section>
	);
}
