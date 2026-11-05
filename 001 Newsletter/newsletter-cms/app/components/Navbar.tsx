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
		<header className="pill-header">
			{/* DaisyUI controls adapted from https://daisyui.com/components/navbar/ */}
			<Link href="/" className="glass-pill brand-pill" aria-label="Newsletter CMS home">
				<span className="brand-full">Newsletter CMS</span>
				<span className="brand-short" aria-hidden="true">CMS</span>
			</Link>
			<nav aria-label="Main navigation" className="glass-pill navigation-pill">
				<ul className="navigation-links">
					{links.map(({ href, label }) => {
						const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
						return (
							<li key={href}>
								<Link href={href} aria-current={active ? "page" : undefined}
									className={`btn btn-ghost nav-pill-link${active ? " nav-pill-link-active" : ""}`}>
									{label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
			<div className="glass-pill account-pill">
				{user ? (
					<details className="dropdown dropdown-end">
						<summary className="btn btn-ghost account-trigger" aria-label={`Account menu for ${name}`}>
							<span className="account-initial" aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span>
							<span className="account-name">{name}</span>
						</summary>
						<ul className="menu dropdown-content glass-menu">
							<li><Link href="/dashboard">Dashboard</Link></li>
							<li><button type="button" onClick={onLogout} disabled={!onLogout}>Log out</button></li>
						</ul>
					</details>
				) : (
					<>
						<Link href="/login" className="btn btn-ghost nav-pill-link">Log in</Link>
						<Link href="/register" className="btn btn-neutral nav-pill-link">Register</Link>
					</>
				)}
			</div>
		</header>
	);
}
