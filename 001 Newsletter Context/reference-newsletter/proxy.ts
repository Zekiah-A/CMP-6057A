import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Brief v4 pp. 2–3 requires authenticated dashboard access. Auth.js verifies JWT/session authenticity.
export default auth((request) => {
	if (!request.auth?.user?.id) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("callbackUrl", "/dashboard");
		return NextResponse.redirect(loginUrl);
	}
});

export const config = { matcher: ["/dashboard/:path*"] };
