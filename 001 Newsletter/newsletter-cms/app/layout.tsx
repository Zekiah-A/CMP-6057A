import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Newsletter CMS",
	description: "Simple CMS System for Newsletters by Zekiah-A",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
			<body className="min-h-full flex flex-col items-center">
				<Navbar/>
				<main className="flex-1 flex flex-col gap-2 p-4 w-full md:w-[clamp(600px,70vw,1200px)] mx-auto">
					{children}
				</main>
				<Footer/>
			</body>
		</html>
	);
}
