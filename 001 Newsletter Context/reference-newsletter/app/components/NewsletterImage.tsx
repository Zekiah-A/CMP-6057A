"use client";

import { useState } from "react";

function SafeNewsletterImage({ src, title }: { src: string; title: string }) {
	const [failed, setFailed] = useState(false);
	let safeSrc: string | null = null;
	try {
		const url = new URL(src);
		if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password) safeSrc = url.href;
	} catch {
		// Invalid or empty image URLs are omitted.
	}

	if (!safeSrc || failed) {
		return <div className="px-5 pt-5 text-sm text-base-content/60">{failed ? "Image unavailable" : "No image"}</div>;
	}

	return (
		// eslint-disable-next-line @next/next/no-img-element -- Use the supplied public URL directly; avoid Next image proxy fetches.
		<img
			// A cached failure may occur before hydration attaches onError.
			ref={(image) => { if (image?.complete && image.naturalWidth === 0) setFailed(true); }}
			src={safeSrc}
			alt={`${title} newsletter image`}
			width={800}
			height={400}
			loading="lazy"
			referrerPolicy="no-referrer"
			onError={() => setFailed(true)}
			className="max-h-64 w-full rounded-t-box object-cover"
		/>
	);
}

export default function NewsletterImage({ src, title }: { src: string; title: string }) {
	return <SafeNewsletterImage key={src} src={src} title={title} />;
}
