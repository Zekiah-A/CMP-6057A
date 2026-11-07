import { RegisterForm } from "@/app/components/RegisterForm";

export default function RegisterPage() {
	return (
		<>
			<section className="flex flex-col items-center justify-center">
				<h1 className="font-title text-2xl md:text-3xl lg:text-4xl font-bold">Create an account</h1>
				<p className="text-base-content/70">Set up an account to manage your newsletters.</p>
			</section>
			<section className="mx-auto">
				<RegisterForm/>
			</section>
			<p className="mt-5 text-center text-sm text-base-content/70">Already registered? <a className="link link-hover font-medium" href="/login">Log in</a></p>
		</>
	);
}
