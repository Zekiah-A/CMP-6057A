"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { newsletterStatuses, type NewsletterFields } from "@/app/lib/newsletter-types";

type NewsletterFormProps = {
	onSave: (fields: NewsletterFields) => void | Promise<void>;
	initial?: NewsletterFields;
};

export default function NewsletterForm({ onSave, initial }: NewsletterFormProps) {
	// Ref: Lab 5, 01-5.0-Auth-custom-credentials-Auth.js.pdf pp. 18–23: form state and feedback.
	// Ref: Week 4 lecture pp. 63–64: pending/error feedback; this is a client-only adaptation.
	// Backend: move mutations and authoritative validation to server actions (Lab 4.1 pp. 14–18).
	const [fields, setFields] = useState<NewsletterFields>({
		title: initial?.title ?? "", content: initial?.content ?? "",
		image: initial?.image ?? "", status: initial?.status ?? "Draft",
	});
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		if (!fields.title.trim() || !fields.content.trim()) {
			setError("Enter a title and some content for your newsletter.");
			return;
		}
		if (fields.image) {
			let url: URL;
			try { url = new URL(fields.image); }
			catch {
				setError("Enter a valid image URL.");
				return;
			}
			if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
				setError("Use an HTTP or HTTPS image URL without login details.");
				return;
			}
		}
		setPending(true);
		try {
			await onSave({ ...fields, title: fields.title.trim(), image: fields.image.trim() });
		}
		catch {
			setError("Couldn't save your newsletter. Please try again.");
		}
		finally {
			setPending(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
			{error && <p role="alert" className="text-sm text-error">{error}</p>}
			<fieldset className="flex flex-col gap-4" disabled={pending}>
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium" htmlFor="title">Title</label>
					<input id="title" name="title" type="text" required maxLength={200} className="input w-full"
						value={fields.title} onChange={(event) => setFields({ ...fields, title: event.target.value })} />
				</div>
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium" htmlFor="content">Content</label>
					<textarea id="content" name="content" required maxLength={20000} rows={12} className="textarea w-full"
						value={fields.content} onChange={(event) => setFields({ ...fields, content: event.target.value })} />
				</div>
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium" htmlFor="image">Image URL <span className="text-base-content/70">(optional)</span></label>
					<input id="image" name="image" type="url" maxLength={2048} className="input w-full" placeholder="https://example.com/image.jpg"
						value={fields.image} onChange={(event) => setFields({ ...fields, image: event.target.value })} />
				</div>
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium" htmlFor="status">Status</label>
					<select id="status" name="status" className="select w-full" value={fields.status}
						onChange={(event) => setFields({ ...fields, status: event.target.value as NewsletterFields["status"] })}>
						{newsletterStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
					</select>
					<p className="text-sm text-base-content/70">Draft and Schedule stay private. Sent appears in the public feed.</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<button type="submit" className="btn btn-neutral rounded-full" disabled={pending}>
						{pending && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
						{pending ? "Saving…" : initial ? "Save changes" : "Create newsletter"}
					</button>
					<Link href="/dashboard" className="btn btn-ghost rounded-full">Cancel</Link>
				</div>
			</fieldset>
		</form>
	);
}
