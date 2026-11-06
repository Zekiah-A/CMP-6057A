import { requireUserId } from "@/app/lib/session";
import NewsletterForm from "@/app/components/NewsletterForm";
import { createNewsletter } from "@/app/actions/newsletters";

export default async function CreateNewsletterPage() {
	await requireUserId();
	return (
		<section className="mx-auto w-full max-w-2xl space-y-5">
			<div className="space-y-2">
				<p className="badge badge-outline">Your workspace</p>
				<h1 className="text-3xl font-bold">Create newsletter</h1>
				<p className="text-base-content/70">Add the details and choose a status for your newsletter.</p>
			</div>
			<NewsletterForm action={createNewsletter} />
		</section>
	);
}
