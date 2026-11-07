"use client";

import { useEffect, useRef } from "react";

type SearchbarProps = {
	value: string;
	onChange: (value: string) => void;
};

export default function Searchbar({ value, onChange }: SearchbarProps) {
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
		<label className="input w-full sm:max-w-sm">
			<input type="search" className="grow min-w-0" placeholder="Search newsletters" aria-label="Search newsletters" ref={inputRef}
				value={value} onChange={(event) => onChange(event.target.value)} />
			<kbd className="kbd kbd-sm hidden sm:inline-flex">Ctrl/⌘ K</kbd>
		</label>
	);
}