"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

// Ref: Lab 5 pp. 18–23: labelled credential form and inline feedback, adapted for Auth.js - Zekiah
export default function LoginForm({ registered }: { registered: boolean }) {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);

	async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setPending(true);
		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});
			if (result?.error || !result?.ok) {
				setError("We couldn't sign you in with those details. Check your email and password and try again.");
				return;
			}
			router.replace("/dashboard");
			router.refresh();
		}
		catch {
			setError("We couldn't sign you in right now. Please try again.");
		}
		finally {
			setPending(false);
		}
	}

	return (
		<div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
			{registered && <p role="status" className="alert alert-success mb-5">Account created. You can now log in.</p>}
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="form-control w-full">
					<label className="label" htmlFor="email">
						<span className="label-text font-medium">Email</span>
					</label>
					<input id="email" name="email" type="email" autoComplete="email" required
						className="input w-full" value={email} onChange={(event) => setEmail(event.target.value)} />
				</div>
				<div className="form-control w-full">
					<label className="label" htmlFor="password">
						<span className="label-text font-medium">Password</span>
					</label>
					<input id="password" name="password" type="password" autoComplete="current-password" required
						className="input w-full" value={password} onChange={(event) => setPassword(event.target.value)} />
				</div>
				{error && <p role="alert" className="text-sm text-error">{error}</p>}
				<button className="btn btn-neutral w-full" type="submit" disabled={pending}>
					{pending && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
					{pending ? "Logging in…" : "Log in"}
				</button>
			</form>
			<p className="mt-5 text-center text-sm text-base-content/70">
				New here? <Link href="/register" className="link link-hover font-medium">Create an account</Link>
			</p>
		</div>
	);
}
