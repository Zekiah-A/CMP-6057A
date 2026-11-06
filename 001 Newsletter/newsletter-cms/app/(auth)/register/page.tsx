export default function RegisterPage() {
	return (
		<>
			<section className="flex flex-col items-center justify-center">
				<h1 className="font-title text-2xl md:text-3xl lg:text-4xl font-bold">Create an account</h1>
				<p className="text-base-content/70">Set up an account to manage your newsletters.</p>
			</section>
			<section className="mx-auto">
				{/*Ref: https://daisyui.com/components/card/ Inspired by daisyUI card component*/}
				<form className="flex flex-col max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8 gap-1">
					{/* Ref: https://daisyui.com/components/input/?lang=en Inspired by Text input and With fieldset and fieldset-legend demo
						validation UI interactivity from https://daisyui.com/components/validator/ - Zekiah */}
					<fieldset className="fieldset">
						<legend className="fieldset-legend">What is your name?</legend>
						<input type="text" className="input" placeholder="John Doe" />
						<p className="label">Optional</p>
					</fieldset>
					<fieldset className="fieldset">
						<label className="label" htmlFor="email">Email*</label>
						<input type="email" id="email" className="input validator" required />
						<span className="validator-hint hidden">Enter valid email address</span>
					</fieldset>
					<fieldset className="fieldset">
						<label className="label" htmlFor="password">Password*</label>
						<input type="password" id="password" className="input validator" required
							minLength={8} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
							title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
						<p className="validator-hint hidden">
							Must be more than 8 characters, including
							<br/>At least one number
							<br/>At least one lowercase letter
							<br/>At least one uppercase letter
						</p>
					</fieldset>
					<fieldset className="fieldset">
						<label className="label" htmlFor="confirmPassword">Confirm Password*</label>
						<input type="password" id="confirmPassword" className="input validator" required placeholder="" />
					</fieldset>
					<button type="submit" className="btn">Register</button>
				</form>
			</section>
			<p className="mt-5 text-center text-sm text-base-content/70">Already registered? <a className="link link-hover font-medium" href="/login">Log in</a></p>
		</>
	);
}
