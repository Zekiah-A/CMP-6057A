import Searchbar from "../components/Searchbar";

export default function NewslettersPage() {
	return (
		<>
			{/*Ref: Inspired by https://daisyui.com/components/input/?lang=en searchbar - Zekiah */}
			<section className="flex flex-col items-center justify-center">
				<h1 className="font-title text-2xl md:text-3xl lg:text-4xl font-bold">Newsletters</h1>
				<p className="text-base-content/70">Search and view all published newsletters in the global feed.</p>
			</section>
			<section className="flex flex-col items-center gap-1">
				<Searchbar></Searchbar>
				{/* Ref: Using new popover API as recommended by daisyui dropdown https://daisyui.com/components/dropdown/#method-2-popover-api-and-anchor-positioning-new
				   https://developer.mozilla.org/en-US/docs/Web/API/Popover_API - Zekiah */}
				<button className="btn flex gap-2" popoverTarget="filter-popover" style={{ anchorName: "--filter-anchor" } as React.CSSProperties}>
					<span>Apply Filter</span>
					{/* Attribution: Icon derived from Google Icons (https://fonts.google.com/icons?selected=Material+Symbols+Outlined:filter_alt:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=filter&icon.size=24&icon.color=%23e3e3e3&icon.platform=web)
						© Google (2026), released under the Apache License Version 2.0 https://github.com/google/material-design-icons/blob/master/LICENSE - Zekiah */}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#e3e3e3"><path d="M11,20q-0.42,0-0.71-0.29Q10,19.43 10,19V13L4.2,5.6Q3.83,5.1 4.09,4.55T5,4H19q0.65,0 0.91,0.55T19.8,5.6L14,13v6q0,0.43-0.29,0.71T13,20H11Zm1-7.7L16.95,6H7.05L12,12.3Zm0,0Z" /></svg>
				</button>
				<ul className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
					popover="auto" id="filter-popover" style={{ positionAnchor: "--filter-anchor" } as React.CSSProperties}>
					<li>
						<a>Item 1</a>
					</li>
					<li>
						<a>Item 2</a>
					</li>
				</ul>
			</section>
		</>
	);
}
