
"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

type FieldName = "name" | "email" | "password" | "confirmPassword";
type RegistrationResponse = {
	message?: string;
	error?: string;
	errors?: Partial<Record<FieldName, string>>;
};

// Lab 5 pp. 18–23: labelled registration form and inline feedback, adapted to the reference API - Zekiah
export function RegisterForm() {
	const router = useRouter();
	const formRef = useRef<HTMLFormElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const [formError, setFormError] = useState("");
	const [pending, setPending] = useState(false);

	// Ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation  Using HTML validation API - Zekiahs
	function clearValidity(event: FormEvent<HTMLInputElement>) {
		event.currentTarget.setCustomValidity("");
	}

	function validatePasswords() {
		const password = passwordRef.current;
		const confirmPassword = confirmPasswordRef.current;

		if (!password || !confirmPassword) {
			return false;
		}

		confirmPassword.setCustomValidity(
			password.value !== confirmPassword.value
				? "Passwords do not match."
				: ""
		);

		return confirmPassword.checkValidity();
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const form = event.currentTarget;
		setFormError("");

		if (!validatePasswords()) {
			form.reportValidity();
			return;
		}

		const data = new FormData(form);
		const fields = Object.fromEntries(data.entries());

		setPending(true);
		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(fields),
			});

			const result = await response.json() as RegistrationResponse;

			if (response.status === 201) {
				router.replace("/login?registered=1");
				return;
			}

			if (result.errors) {
				for (const [name, message] of Object.entries(result.errors)) {
					const input = form.elements.namedItem(name);
					if (input instanceof HTMLInputElement && message) {
						input.setCustomValidity(message);
					}
				}
				if (!form.checkValidity()) {
					form.reportValidity();
					return;
				}
			}

			setFormError(result.error ?? "Couldn't create your account. Please try again.");
		}
		catch {
			setFormError("Couldn't reach the registration service. Please try again.");
		}
		finally {
			setPending(false);
		}
	}

	return (
		// Ref: https://daisyui.com/components/card/ Inspired by daisyUI card component - Zekiah
		<form ref={formRef} onSubmit={handleSubmit} className="flex flex-col max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8 gap-1">
			{/* Ref: https://daisyui.com/components/input/?lang=en Inspired by Text input and With fieldset and fieldset-legend demo
				validation UI interactivity from https://daisyui.com/components/validator/ - Zekiah */}
			<fieldset className="fieldset">
				<legend className="fieldset-legend">What is your name?</legend>
				<input type="text" name="name" className="input" placeholder="John Doe" onInput={clearValidity} />
				<p className="label">Optional</p>
			</fieldset>
			<fieldset className="fieldset">
				<label className="label" htmlFor="email">Email*</label>
				<input type="email" name="email" id="email" className="input validator" required onInput={clearValidity} />
				<span className="validator-hint hidden">Enter valid email address</span>
			</fieldset>
			<fieldset className="fieldset">
				<label className="label" htmlFor="password">Password*</label>
				<input type="password" name="password" id="password" ref={passwordRef}
					className="input validator" required minLength={8}
					pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
					title="Must be at least 8 characters, including a number, lowercase letter and uppercase letter"
					onInput={(event) => {
						clearValidity(event);
						confirmPasswordRef.current?.setCustomValidity("");
					}} />
				<p className="validator-hint hidden">
					Must be at least 8 characters, including
					<br/>At least one number
					<br/>At least one lowercase letter
					<br/>At least one uppercase letter
				</p>
			</fieldset>
			<fieldset className="fieldset">
				<label className="label" htmlFor="confirmPassword">Confirm Password*</label>
				<input type="password" name="confirmPassword" id="confirmPassword"
					ref={confirmPasswordRef} className="input validator" required
					onInput={(event) => {
						clearValidity(event);
						if (passwordRef.current && event.currentTarget.value !== passwordRef.current.value) {
							event.currentTarget.setCustomValidity("Passwords do not match.");
						}
					}} />
			</fieldset>
			{formError && <p role="alert" className="text-error text-sm">{formError}</p>}
			<button type="submit" className="btn" disabled={pending}>
				{pending ? "Registering..." : "Register"}
			</button>
		</form>
	);
}
