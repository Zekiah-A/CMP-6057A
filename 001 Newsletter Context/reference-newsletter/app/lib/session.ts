import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

// New ownership safeguard: each protected server page/action verifies the user still exists.
export async function requireUserId(): Promise<string> {
	const session = await auth();
	const id = session?.user?.id;
	if (!id) redirect("/login");
	const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
	if (!user) redirect("/login");
	return user.id;
}
