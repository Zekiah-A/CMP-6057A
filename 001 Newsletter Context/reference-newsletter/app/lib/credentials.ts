import { z } from "zod";

const emailSchema = z.string().trim().max(254).pipe(z.email()).transform((email) => email.toLowerCase());
const passwordSchema = z.string().min(12).refine((password) => new TextEncoder().encode(password).length <= 72, "Password must be at most 72 UTF-8 bytes.");

export const loginSchema = z.object({ email: emailSchema, password: passwordSchema });
export const registrationSchema = z.object({
	name: z.string().trim().max(80).optional().transform((name) => name || null),
	email: emailSchema,
	password: passwordSchema,
	confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
	path: ["confirmPassword"], message: "Passwords do not match.",
});
