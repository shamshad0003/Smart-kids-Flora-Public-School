"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    // While loading, show a spinner
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // If no session, redirect (middleware handles this but just in case)
    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    const userName = session?.user?.name ?? "Admin";

    return (
        <div className="min-h-screen bg-slate-100 flex overflow-hidden">
            <Sidebar
                isMobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AdminHeader
                    userName={userName}
                    onMobileMenuToggle={() => setMobileOpen(true)}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
