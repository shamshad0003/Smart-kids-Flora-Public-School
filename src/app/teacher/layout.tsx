import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ReactNode } from "react";

export default async function TeacherLayout({ children }: { children: ReactNode }) {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "TEACHER") {
        redirect("/login");
    }
    return (
        <DashboardLayout role="teacher" userName={session.user?.name ?? "Teacher"}>
            {children}
        </DashboardLayout>
    );
}
