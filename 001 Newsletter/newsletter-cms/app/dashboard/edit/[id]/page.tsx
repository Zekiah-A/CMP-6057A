import NewsletterForm from "@/app/components/NewsletterForm";
import { updateNewsletter } from "@/app/actions/newsletters";
import { getOwnNewsletter } from "@/app/lib/newsletters";

type EditNewsletterPageProps = {
	params: Promise<{ id: string }>;
};

export default async function EditNewsletterPage({ params }: EditNewsletterPageProps) {
	const { id } = await params;
	const newsletter = await getOwnNewsletter(id);
	const updateThisNewsletter = updateNewsletter.bind(null, id);

	return (
		<section className="mx-auto w-full max-w-2xl space-y-5">
			<div className="space-y-2">
				<p className="badge badge-outline">Your workspace</p>
				<h1 className="text-3xl font-bold">Edit newsletter</h1>
				<p className="text-base-content/70">Update this newsletter’s details and status.</p>
			</div>
			<NewsletterForm action={updateThisNewsletter} initial={newsletter} />
		</section>
	);
}
