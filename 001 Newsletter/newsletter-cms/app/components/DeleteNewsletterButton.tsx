"use client";

import { useNewsletterWorkspace } from "./NewsletterWorkspace";

export default function DeleteNewsletterButton({ id, onDeleted }: { id: string; onDeleted?: () => void }) {
	const { deleteNewsletter } = useNewsletterWorkspace();

	function handleDelete() {
		if (!window.confirm("Delete this newsletter? This cannot be undone.")) return;
		deleteNewsletter(id);
		onDeleted?.();
	}

	return <button type="button" className="btn btn-sm btn-outline btn-error rounded-full" onClick={handleDelete}>Delete</button>;
}
