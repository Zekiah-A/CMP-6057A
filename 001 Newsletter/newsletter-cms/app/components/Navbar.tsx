"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavbarProps = {
	user?: { name?: string | null; email?: string | null } | null;
	onLogout?: () => void;
};

export default function Navbar({ user = null, onLogout }: NavbarProps) {
	const pathname = usePathname();
	const links = [
		{ href: "/", label: "Home" },
		{ href: "/newsletters", label: "Newsletters" },
		...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
	];
	const name = user?.name || user?.email || "Account";

	return (
		<header className="navbar mx-auto w-full max-w-6xl flex-wrap gap-y-3 px-4 py-3 sm:px-6">
			{/* Layout and controls: https://daisyui.com/components/navbar/ */}
			<div className="navbar-start w-1/2 md:flex-1">
				<Link href="/" className="btn btn-sm btn-ghost h-10 min-h-10 rounded-full bg-base-200" aria-label="Newsletter CMS home">
					{/* Attribution: Icon derived from Google Icons (https://fonts.google.com/icons?selected=Material+Symbols+Outlined:newspaper:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=article&icon.size=24&icon.color=%23e3e3e3&icon.platform=web)
						© Google (2026), released under the Apache License Version 2.0 https://github.com/google/material-design-icons/blob/master/LICENSE - Zekiah */}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M4,21q-0.82,0-1.41-0.59T2,19V3L3.68,4.67L5.33,3L7,4.67L8.68,3l1.65,1.67L12,3l1.68,1.67L15.33,3L17,4.67L18.68,3l1.65,1.67L22,3V19q0,0.82-0.59,1.41T20,21H4Zm0-2h7V13H4v6Zm9,0h7V17H13v2Zm0-4h7V13H13v2ZM4,11H20V8H4v3Z"/></svg>
					<span className="hidden sm:inline">
						Newsletter CMS
					</span>
				</Link>
			</div>
			<nav aria-label="Main navigation" className="navbar-center order-last w-full justify-center md:order-none md:w-auto">
				<ul className="menu menu-horizontal menu-sm h-10 items-center gap-1 rounded-full bg-base-200 p-1">
					{links.map(({ href, label }) => {
						const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
						return (
							<li key={href}>
								<Link href={href} aria-current={active ? "page" : undefined}
									className={`h-8 flex items-center rounded-full${active ? " menu-active" : ""}`}>
									{label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
			<div className="navbar-end w-1/2 md:flex-1">
				{user ? (
					<details className="dropdown dropdown-end">
						<summary className="btn btn-sm btn-ghost h-10 min-h-10 rounded-full bg-base-200">
							<span className="max-w-24 truncate">{name}</span>
						</summary>
						<ul className="menu dropdown-content z-10 mt-2 w-48 rounded-box bg-base-200 p-2 shadow-sm">
							<li><Link href="/dashboard">Dashboard</Link></li>
							<li><button type="button" onClick={onLogout} disabled={!onLogout}>Log out</button></li>
						</ul>
					</details>
				) : (
					<div className="flex h-10 items-center rounded-full bg-base-200 p-1">
						<Link href="/login" className="btn btn-sm btn-ghost rounded-full">Log in</Link>
						<Link href="/register" className="btn btn-sm btn-neutral rounded-full">Register</Link>
					</div>
				)}
			</div>
		</header>
	);
}
