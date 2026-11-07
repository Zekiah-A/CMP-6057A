import LoginForm from "@/app/components/LoginForm";

type LoginPageProps = {
	searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const { registered } = await searchParams;
	return (
		<>
			<section className="space-y-2 text-center">
				<h1 className="text-3xl font-bold sm:text-4xl">Login</h1>
				<p className="text-base-content/70">Log into your account, and make and manage newsletters.</p>
			</section>
			<section className="mx-auto w-full max-w-md">
				<LoginForm registered={registered === "1"} />
			</section>
		</>
	);
}
