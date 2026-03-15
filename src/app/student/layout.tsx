import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ReactNode } from "react";

export default async function StudentLayout({ children }: { children: ReactNode }) {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "STUDENT") {
        redirect("/login");
    }
    return (
        <DashboardLayout role="student" userName={session.user?.name ?? "Student"}>
            {children}
        </DashboardLayout>
    );
}
