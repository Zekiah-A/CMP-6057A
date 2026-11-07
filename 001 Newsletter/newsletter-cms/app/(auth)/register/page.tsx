import { RegisterForm } from "@/app/components/RegisterForm";

export default function RegisterPage() {
	return (
		<>
			<section className="space-y-2 text-center">
				<h1 className="text-3xl font-bold sm:text-4xl">Create an account</h1>
				<p className="text-base-content/70">Set up an account to manage your newsletters.</p>
			</section>
			<section className="mx-auto w-full max-w-md">
				<RegisterForm/>
			</section>
			<p className="text-center text-sm text-base-content/70">Already registered? <a className="link link-hover font-medium" href="/login">Log in</a></p>
		</>
	);
}
