"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Lab 5 pp. 33–38: Auth.js session hook adapted for shared navigation.
// Full source filename and links: README.md, Sources.
export default function Navbar() {
	const pathname = usePathname();
	const { data: session, status } = useSession();
	const user = session?.user;
	const authenticated = status === "authenticated";
	const links = [
		{ href: "/", label: "Home" },
		{ href: "/newsletters", label: "Newsletters" },
		...(authenticated ? [{ href: "/dashboard", label: "Dashboard" }] : []),
	];
	const name = user?.name || user?.email || "Account";
	const initials = name
		.split(/[\s@._-]+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0].toUpperCase())
		.join("") || "A";

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
					{links.map(({ href, label }) => {
						const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
						return (
							<li key={href}>
								<Link href={href} aria-current={active ? "page" : undefined} className={`rounded-full${active ? " menu-active" : ""}`}>
									{label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
			<div className="navbar-end">
				{authenticated ? (
					<details className="dropdown dropdown-end">
						<summary className="btn btn-sm btn-ghost h-10 min-h-10 rounded-full bg-base-200">
							<span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-base-300 text-xs font-semibold">{initials}</span>
							<span className="max-w-24 truncate">{name}</span>
						</summary>
						<ul className="menu dropdown-content z-10 mt-2 w-48 rounded-box bg-base-200 p-2 shadow-sm">
							<li><Link href="/dashboard">Dashboard</Link></li>
							<li><button type="button" onClick={() => signOut({ callbackUrl: "/login" })}>Log out</button></li>
						</ul>
					</details>
				) : status === "unauthenticated" ? (
					<div className="flex h-10 items-center rounded-full bg-base-200 p-1">
						<Link href="/login" className="btn btn-sm btn-ghost rounded-full" aria-current={pathname === "/login" ? "page" : undefined}>Log in</Link>
						<Link href="/register" className="btn btn-sm btn-neutral rounded-full" aria-current={pathname === "/register" ? "page" : undefined}>Register</Link>
					</div>
				) : (
					<span className="h-10 w-24" aria-hidden="true" />
				)}
			</div>
		</header>
	);
}
