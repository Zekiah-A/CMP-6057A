import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "./components/Navbar";
import Providers from "./components/Providers";

export const metadata: Metadata = {
	title: "Newsletter CMS — AI-generated reference",
	description: "Authentication reference for the Newsletter CMS learning project.",
};

// Lab 3.0 pp. 10–16: shared navbar and Next route layout, adapted.
// Full source filenames, page numbers and links: README.md, Sources.
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" data-theme="light">
			<body className="flex min-h-screen flex-col bg-base-100 text-base-content">
				<Providers>
					<div className="bg-warning px-4 py-2 text-center text-sm font-semibold">
						AI-generated reference · Slice 2: authentication
					</div>
					<Navbar />
					<main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">{children}</main>
					<footer className="border-t border-base-300 px-4 py-4 text-center text-sm">
						Newsletter CMS reference · Newsletter management is not implemented yet
					</footer>
				</Providers>
			</body>
		</html>
	);
}
