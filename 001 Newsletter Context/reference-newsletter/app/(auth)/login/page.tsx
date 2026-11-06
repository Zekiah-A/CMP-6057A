import LoginForm from "@/app/components/LoginForm";

type LoginPageProps = {
	searchParams: Promise<{ registered?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const params = await searchParams;
	const registered = params.registered === "1";

	return (
		<section className="mx-auto w-full max-w-md space-y-5">
			<div className="space-y-2 text-center">
				<p className="badge badge-outline">Newsletter CMS</p>
				<h1 className="text-3xl font-bold">Log in</h1>
				<p className="text-base-content/70">Sign in to manage your newsletters.</p>
			</div>
			<LoginForm registered={registered} />
		</section>
	);
}
