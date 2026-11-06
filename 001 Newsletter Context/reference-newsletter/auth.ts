import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rate-limit";
import { loginSchema } from "@/app/lib/credentials";

// Lab 5 (01-5.0-Auth-custom-credentials-Auth.js.pdf), pp. 30–38:
// Credentials provider and JWT callbacks adapted to propagate the database id.
// Lab 5 pp. 4–9: registration stores bcrypt hashes; Brief v4 pp. 2–3 requires secure credentials.
const dummyHash = "$2b$12$/OIA7WA4cp/F.lN3xU17c.1DvWVfF0EoZinh1t7nZwadCREjbQcAC";
const localCookie = (name: string) => ({
	name: `newsletter-reference.${name}`,
	options: { httpOnly: true, sameSite: "lax" as const, path: "/", secure: false },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
	trustHost: true,
	// Log event categories, not raw Auth.js errors that can contain session payloads.
	logger: { error(error) { console.error("Authentication error:", error.name); } },
	// This reference is local HTTP-only on port 3001; these cookie settings are not for production.
	useSecureCookies: false,
	cookies: {
		sessionToken: localCookie("session-token"),
		csrfToken: localCookie("csrf-token"),
		callbackUrl: localCookie("callback-url"),
	},
	pages: { signIn: "/login" },
	session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
	providers: [Credentials({
		credentials: { email: {}, password: {} },
		async authorize(raw) {
			const parsed = loginSchema.safeParse(raw);
			if (!parsed.success || bcrypt.truncates(String(raw?.password ?? ""))) return null;
			const { email, password } = parsed.data;
			if (!checkRateLimit(`login:${email}`, 10)) return null;
			try {
				const user = await prisma.user.findUnique({ where: { email } });
				const valid = await bcrypt.compare(password, user?.password ?? dummyHash);
				if (!user || !valid) return null;
				return { id: user.id, email: user.email, name: user.name };
			} catch {
				console.error("Credential verification failed.");
				return null;
			}
		},
	})],
	callbacks: {
		jwt({ token, user }) {
			if (user) token.id = user.id;
			return token;
		},
		session({ session, token }) {
			if (token.id) session.user.id = String(token.id);
			return session;
		},
	},
});
