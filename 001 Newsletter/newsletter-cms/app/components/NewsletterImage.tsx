"use client";

import { useState } from "react";

export default function NewsletterImage({ src }: { src: string }) {
	const [failed, setFailed] = useState(false);
	let safe = false;
	try {
		const url = new URL(src);
		safe = ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
	}
	catch { /* An invalid URL uses the same fallback as a failed image. */ }

	if (!safe || failed) return <p className="rounded-t-2xl bg-base-200 p-6 text-sm text-base-content/70">Image unavailable</p>;

	// URL-based images match the brief's image field; no upload service or HTML content.
	return (
		// eslint-disable-next-line @next/next/no-img-element -- External user-supplied URLs, without an image proxy.
		<img src={src} alt="" width={800} height={400} loading="lazy" referrerPolicy="no-referrer"
			className="max-h-64 w-full rounded-t-2xl object-cover" onError={() => setFailed(true)} />
	);
}
