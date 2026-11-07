import type { ReactNode } from "react";
import NewsletterWorkspace from "@/app/components/NewsletterWorkspace";

// Ref: Week 3 lecture, 01-3-Next.js-RTK-v2.pdf pp. 16–26: shared nested route layouts.
// Backend still required: protect /dashboard AND every data read/mutation on the server.
export default function DashboardLayout({ children }: { children: ReactNode }) {
	return <NewsletterWorkspace>{children}</NewsletterWorkspace>;
}
