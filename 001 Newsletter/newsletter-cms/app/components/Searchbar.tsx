"use client";

import { useEffect, useRef } from "react";

export default function Searchbar() {
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault();
				inputRef.current?.focus();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<label className="input">
			{/* Search SVG and Input here */}
			<input type="search" className="grow" placeholder="Search" ref={inputRef} />
			<kbd className="kbd kbd-sm">⌘</kbd>
			<kbd className="kbd kbd-sm">K</kbd>
		</label>
	);
}