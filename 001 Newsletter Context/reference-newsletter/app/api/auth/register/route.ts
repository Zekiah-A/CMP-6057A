import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/app/lib/prisma";
import { registrationSchema } from "@/app/lib/credentials";
import { checkRateLimit } from "@/app/lib/rate-limit";

const genericError = { error: "Unable to create account. Check your details and try again." };

// Adapted from Lab 5 pp. 4–9: validate, hash, and persist registration.
// Origin checks, byte limits, throttling and duplicate-race handling are new safeguards.
export async function POST(request: Request) {
	if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
		return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
	}
	const origin = request.headers.get("origin");
	if (origin) {
		try {
			if (new URL(origin).origin !== new URL(request.url).origin) {
				return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
			}
		} catch {
			return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
		}
	}
	const length = Number(request.headers.get("content-length") ?? 0);
	if (length > 20_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
	let text: string;
	try {
		text = await request.text();
	} catch {
		return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
	}
	if (Buffer.byteLength(text, "utf8") > 20_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
	let body: unknown;
	try {
		body = JSON.parse(text);
	} catch {
		return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
	}
	const parsed = registrationSchema.safeParse(body);
	if (!parsed.success) {
		const errors: Record<string, string> = {};
		for (const issue of parsed.error.issues) {
			const field = String(issue.path[0] ?? "form");
			if (!errors[field]) errors[field] = issue.message;
		}
		return NextResponse.json({ error: "Please correct the highlighted fields.", errors }, { status: 400 });
	}
	const { name, email, password } = parsed.data;
	if (bcrypt.truncates(password)) return NextResponse.json({ error: "Password is too long." }, { status: 400 });
	if (!checkRateLimit(`register:${email}`, 5)) {
		return NextResponse.json({ error: "Unable to create account. Try again later." }, { status: 429 });
	}
	try {
		const hash = await bcrypt.hash(password, 12);
		await prisma.user.create({ data: { email, name, password: hash } });
		return NextResponse.json({ message: "Account created." }, { status: 201 });
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
			return NextResponse.json({ error: "An account with these details already exists." }, { status: 409 });
		}
		console.error("Account registration failed.");
		return NextResponse.json(genericError, { status: 500 });
	}
}
