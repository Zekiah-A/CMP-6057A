"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { NewsletterState } from "@/app/lib/newsletter-validation";

type NewsletterInitial = {
	id?: string;
	title: string;
	content: string;
	image: string;
	status: "Draft" | "Schedule" | "Sent";
};

type NewsletterFormProps = {
	action: (state: NewsletterState, formData: FormData) => Promise<NewsletterState>;
	initial?: NewsletterInitial;
};

export default function NewsletterForm({ action, initial }: NewsletterFormProps) {
	// Week 4 lecture pp. 63–64: action state drives validation/pending feedback.
	// Controlled fields preserve the author's input when server validation fails.
	const [fields, setFields] = useState<Record<"title" | "content" | "image" | "status", string>>({
		title: initial?.title ?? "", content: initial?.content ?? "",
		image: initial?.image ?? "", status: initial?.status ?? "Draft",
	});
	const [state, formAction, pending] = useActionState<NewsletterState, FormData>(action, {});

	return (
		<form action={formAction} className="space-y-5 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
			{initial?.id && <input type="hidden" name="id" value={initial.id} />}
			{state.error && <p role="alert" className="alert alert-error">{state.error}</p>}
			<div className="form-control w-full">
				<label className="label" htmlFor="title"><span className="label-text font-medium">Title</span></label>
				<input id="title" name="title" type="text" required maxLength={200} className="input input-bordered w-full"
					value={fields.title} onChange={(event) => setFields({ ...fields, title: event.target.value })} aria-invalid={Boolean(state.errors?.title)} aria-describedby={state.errors?.title ? "title-error" : undefined} />
				{state.errors?.title && <p id="title-error" role="alert" className="mt-1 text-sm text-error">{state.errors.title}</p>}
			</div>
			<div className="form-control w-full">
				<label className="label" htmlFor="content"><span className="label-text font-medium">Content</span></label>
				<textarea id="content" name="content" required maxLength={20000} rows={12} className="textarea textarea-bordered w-full"
					value={fields.content} onChange={(event) => setFields({ ...fields, content: event.target.value })} aria-invalid={Boolean(state.errors?.content)} aria-describedby={state.errors?.content ? "content-error" : undefined} />
				{state.errors?.content && <p id="content-error" role="alert" className="mt-1 text-sm text-error">{state.errors.content}</p>}
			</div>
			<div className="form-control w-full">
				<label className="label" htmlFor="image"><span className="label-text font-medium">Image URL</span></label>
				<input id="image" name="image" type="url" maxLength={2048} className="input input-bordered w-full"
					value={fields.image} onChange={(event) => setFields({ ...fields, image: event.target.value })} aria-invalid={Boolean(state.errors?.image)} aria-describedby={state.errors?.image ? "image-error" : undefined} />
				{state.errors?.image && <p id="image-error" role="alert" className="mt-1 text-sm text-error">{state.errors.image}</p>}
			</div>
			<div className="form-control w-full">
				<label className="label" htmlFor="status"><span className="label-text font-medium">Status</span></label>
				<select id="status" name="status" className="select select-bordered w-full" value={fields.status} onChange={(event) => setFields({ ...fields, status: event.target.value })}
					aria-invalid={Boolean(state.errors?.status)} aria-describedby={state.errors?.status ? "status-error" : undefined}>
					<option value="Draft">Draft</option>
					<option value="Schedule">Schedule</option>
					<option value="Sent">Sent</option>
				</select>
				{state.errors?.status && <p id="status-error" role="alert" className="mt-1 text-sm text-error">{state.errors.status}</p>}
			</div>
			<div className="flex flex-wrap gap-3">
				<button type="submit" className="btn btn-neutral" disabled={pending}>
					{pending && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
					{pending ? "Saving…" : initial ? "Save changes" : "Create newsletter"}
				</button>
				<Link href="/dashboard" className="btn btn-ghost">Cancel</Link>
			</div>
		</form>
	);
}
