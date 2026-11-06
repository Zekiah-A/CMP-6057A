"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type FieldName = "name" | "email" | "password" | "confirmPassword";
type RegistrationResponse = {
	message?: string;
	error?: string;
	errors?: Partial<Record<FieldName, string>>;
};

// Lab 5 pp. 18–23: labelled registration form and inline feedback, adapted to the reference API.
// Full source filename and links: README.md, Sources.
export default function RegistrationForm() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
	const [formError, setFormError] = useState("");
	const [pending, setPending] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setErrors({});
		setFormError("");
		if (password !== confirmPassword) {
			setErrors({ confirmPassword: "Passwords do not match." });
			return;
		}

		setPending(true);
		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password, confirmPassword }),
			});
			const result = await response.json() as RegistrationResponse;
			if (response.status === 201) {
				router.replace("/login?registered=1");
				return;
			}
			setErrors(result.errors ?? {});
			setFormError(result.error ?? "We couldn't create your account. Please try again.");
		} catch {
			setFormError("We couldn't reach the registration service. Please try again.");
		} finally {
			setPending(false);
		}
	}

	return (
		<div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="form-control w-full">
					<label className="label" htmlFor="name"><span className="label-text font-medium">Name <span className="font-normal text-base-content/60">(optional)</span></span></label>
					<input id="name" name="name" type="text" autoComplete="name" maxLength={80}
						className="input input-bordered w-full" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined}
						value={name} onChange={(event) => setName(event.target.value)} />
					{errors.name && <p id="name-error" className="mt-1 text-sm text-error">{errors.name}</p>}
				</div>
				<div className="form-control w-full">
					<label className="label" htmlFor="email"><span className="label-text font-medium">Email</span></label>
					<input id="email" name="email" type="email" autoComplete="email" required
						className="input input-bordered w-full" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined}
						value={email} onChange={(event) => setEmail(event.target.value)} />
					{errors.email && <p id="email-error" className="mt-1 text-sm text-error">{errors.email}</p>}
				</div>
				<div className="form-control w-full">
					<label className="label" htmlFor="password"><span className="label-text font-medium">Password</span></label>
					<input id="password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={72} required
						className="input input-bordered w-full" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : "password-help"}
						value={password} onChange={(event) => setPassword(event.target.value)} />
					<p id="password-help" className="mt-1 text-xs text-base-content/65">Use at least 12 characters. The server also checks the 72-byte limit.</p>
					{errors.password && <p id="password-error" className="mt-1 text-sm text-error">{errors.password}</p>}
				</div>
				<div className="form-control w-full">
					<label className="label" htmlFor="confirmPassword"><span className="label-text font-medium">Confirm password</span></label>
					<input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required
						className="input input-bordered w-full" aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
						value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
					{errors.confirmPassword && <p id="confirm-password-error" className="mt-1 text-sm text-error">{errors.confirmPassword}</p>}
				</div>
				{formError && <p role="alert" className="text-sm text-error">{formError}</p>}
				<button className="btn btn-neutral w-full" type="submit" disabled={pending}>
					{pending && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
					{pending ? "Creating account…" : "Create account"}
				</button>
			</form>
			<p className="mt-5 text-center text-sm text-base-content/70">
				Already registered? <Link href="/login" className="link link-hover font-medium">Log in</Link>
			</p>
		</div>
	);
}
