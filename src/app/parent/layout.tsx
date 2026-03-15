import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ReactNode } from "react";

export default async function ParentLayout({ children }: { children: ReactNode }) {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "PARENT") {
        redirect("/login");
    }
    return (
        <DashboardLayout role="parent" userName={session.user?.name ?? "Parent"}>
            {children}
        </DashboardLayout>
    );
}
