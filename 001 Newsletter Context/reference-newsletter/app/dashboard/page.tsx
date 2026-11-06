import Link from "next/link";
import DeleteNewsletterButton from "@/app/components/DeleteNewsletterButton";
import { getOwnNewsletters } from "@/app/lib/newsletters";

export default async function DashboardPage() {
	const newsletters = await getOwnNewsletters();

	return (
		<section className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div className="space-y-2">
					<p className="badge badge-outline">Your workspace</p>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-base-content/70">Create and manage your newsletters.</p>
				</div>
				<Link href="/dashboard/create" className="btn btn-neutral">Create Newsletter</Link>
			</div>

			{newsletters.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-base-300 p-8 text-center">
					<h2 className="text-xl font-semibold">No newsletters yet</h2>
					<p className="mt-2 text-base-content/70">Create your first newsletter to get started.</p>
					<Link href="/dashboard/create" className="btn btn-neutral mt-5">Create Newsletter</Link>
				</div>
			) : (
				<ul className="space-y-5">
					{newsletters.map((newsletter) => (
						<li key={newsletter.id} className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div className="min-w-0 space-y-2">
									<h2 className="break-words text-xl font-semibold">{newsletter.title}</h2>
									<div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
										<span className="badge badge-outline">{newsletter.status}</span>
										<time dateTime={newsletter.updatedAt.toISOString()}>Updated {newsletter.updatedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Link href={`/dashboard/edit/${newsletter.id}`} className="btn btn-outline btn-sm">Edit</Link>
									<DeleteNewsletterButton id={newsletter.id} />
								</div>
							</div>
							{newsletter.image && <p className="mt-4 break-all text-sm"><span className="font-medium">Image URL: </span>{newsletter.image}</p>}
							<details className="mt-4">
								<summary className="link link-hover cursor-pointer font-medium">View newsletter</summary>
								<div className="mt-3 space-y-3 rounded-lg bg-base-200/60 p-4">
									<p className="whitespace-pre-wrap break-words">{newsletter.content}</p>
								</div>
							</details>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
