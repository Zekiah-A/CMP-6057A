import LoginForm from "@/app/components/LoginForm";

export default function LoginPage() {
	return (
		<>
			<section className="flex flex-col items-center justify-center">
				<h1 className="font-title text-2xl md:text-3xl lg:text-4xl font-bold">Login</h1>
				<p className="text-base-content/70">Log into your account, and make and manage newsletters.</p>
			</section>
			<section className="mx-auto">
				<LoginForm />
			</section>
		</>
	);
}
