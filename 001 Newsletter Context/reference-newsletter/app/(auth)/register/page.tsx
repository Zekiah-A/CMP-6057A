import RegistrationForm from "@/app/components/RegistrationForm";

export default function RegisterPage() {
	return (
		<section className="mx-auto w-full max-w-md space-y-5">
			<div className="space-y-2 text-center">
				<p className="badge badge-outline">Newsletter CMS</p>
				<h1 className="text-3xl font-bold">Create your account</h1>
				<p className="text-base-content/70">Set up an account to manage your newsletters.</p>
			</div>
			<RegistrationForm />
		</section>
	);
}
