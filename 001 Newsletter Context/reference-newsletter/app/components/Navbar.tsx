"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Lab 3.0 pp. 10–16: shared navigation adapted from the local Navbar.
// Full source filenames and links: README.md, Sources. DaisyUI navbar: https://daisyui.com/components/navbar/
export default function Navbar() {
	const pathname = usePathname();
	const links = [
		{ href: "/", label: "Home" },
		{ href: "/newsletters", label: "Newsletters" },
	];

	return (
		<header className="navbar gap-2 p-3">
			<div className="navbar-start">
				<Link href="/" className="btn btn-sm btn-ghost h-10 min-h-10 rounded-full bg-base-200" aria-label="Newsletter CMS home">
					<span className="hidden sm:inline">Newsletter CMS</span>
					<span className="sm:hidden">CMS</span>
				</Link>
			</div>
			<nav aria-label="Main navigation" className="navbar-center">
				<ul className="menu menu-horizontal menu-sm h-10 items-center rounded-full bg-base-200 p-1">
					{links.map(({ href, label }) => (
						<li key={href}>
							<Link href={href} aria-current={pathname === href ? "page" : undefined}
								className={`rounded-full${pathname === href ? " menu-active" : ""}`}>
								{label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<div className="navbar-end">
				<div className="flex h-10 items-center rounded-full bg-base-200 p-1">
					<Link href="/login" className="btn btn-sm btn-ghost rounded-full" aria-current={pathname === "/login" ? "page" : undefined}>Log in</Link>
					<Link href="/register" className="btn btn-sm btn-neutral rounded-full" aria-current={pathname === "/register" ? "page" : undefined}>Register</Link>
				</div>
			</div>
		</header>
	);
}
