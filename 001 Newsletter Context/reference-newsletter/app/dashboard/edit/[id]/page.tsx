import { requireUserId } from "@/app/lib/session";

export default async function EditNewsletterPage() {
	const userId = await requireUserId();
	return (
		<section className="space-y-4">
			<p className="badge badge-outline">AI-generated reference · Authentication</p>
			<h1 className="text-3xl font-bold">Edit newsletter</h1>
			<p>This route is protected. Newsletter editing will be added in a later slice.</p>
			<p className="text-sm text-base-content/70">Signed-in account ID: <code>{userId}</code></p>
		</section>
	);
}
