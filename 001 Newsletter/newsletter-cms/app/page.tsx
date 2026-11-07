import Link from "next/link";

type HomeProps = {
	user?: { name?: string | null; email?: string | null } | null;
};

export default function Home({ user = null }: HomeProps) {
	return (
		<>
			<h1 className="font-title text-2xl md:text-3xl lg:text-4xl font-bold">Simple Newsletter CMS</h1>
			<p className="text-base-content/70">
				Create an account to write, edit and manage your newsletters, or view sent newsletters
				in the public feed.
			</p>
			<h2 className="font-title text-xl md:text-2xl lg:text-3xl">Quick Actions</h2>
			<section className="flex gap-1 p-1">
				{/* This link shows for everyone - Zekiah */}
				<Link className="btn rounded-full" href="/newsletters">
					Browse newsletters
				</Link>
				{/* Links change based on auth state - Zekiah */}
				{user ? (
					<>
						<Link className="btn rounded-full" href="/dashboard/create">
							Create newsletter
						</Link>
						<Link className="btn rounded-full" href="/profile">
							View profile
						</Link>
					</>
				) : (
					<Link className="btn rounded-full" href="/register">
						Create Account
					</Link>
				)}
			</section>
			<h2 className="font-title text-xl md:text-2xl lg:text-3xl">Recent Posts</h2>
			<section className="flex flex-1 flex-col gap-1 p-1">
				{/* Ref: https://daisyui.com/components/stack/ Inspired by daisyUI stack cards example */}
				<div className="stack h-full flex-1">
					<div className="card shadow-md bg-base-100">
						<div className="card-body">
							<h2 className="card-title">Notification 1</h2>
							<p>You have 3 unread messages. Tap here to see.</p>
						</div>
					</div>
					<div className="card shadow-md bg-base-100">
						<div className="card-body">
							<h2 className="card-title">Notification 2</h2>
							<p>You have 3 unread messages. Tap here to see.</p>
						</div>
					</div>
					<div className="card shadow-md bg-base-100">
						<div className="card-body">
							<h2 className="card-title">Notification 3</h2>
							<p>You have 3 unread messages. Tap here to see.</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
