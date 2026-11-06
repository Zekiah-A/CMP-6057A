"use client";

import { useActionState } from "react";
import { deleteNewsletter } from "@/app/actions/newsletters";
import type { NewsletterState } from "@/app/lib/newsletter-validation";

export default function DeleteNewsletterButton({ id }: { id: string }) {
	const action = deleteNewsletter.bind(null, id);
	const [state, formAction, pending] = useActionState<NewsletterState, FormData>(action, {});

	return (
		<div className="space-y-1">
			<form action={formAction} onSubmit={(event) => {
				if (!window.confirm("Delete this newsletter?")) event.preventDefault();
			}}>
				<button type="submit" className="btn btn-error btn-sm" disabled={pending}>
					{pending && <span className="loading loading-spinner loading-xs" aria-hidden="true" />}
					{pending ? "Deleting…" : "Delete"}
				</button>
			</form>
			{state.error && <p role="alert" className="max-w-xs text-sm text-error">{state.error}</p>}
		</div>
	);
}
