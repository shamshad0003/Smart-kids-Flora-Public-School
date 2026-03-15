"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard, BookOpen, ClipboardList, Award,
    Bell, Users, LogOut, Menu, X, GraduationCap,
    ChevronRight,
} from "lucide-react";

type NavItem = { label: string; href: string; icon: React.ElementType };

const teacherNav: NavItem[] = [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "Assignments", href: "/teacher/assignments", icon: BookOpen },
    { label: "Attendance", href: "/teacher/attendance", icon: ClipboardList },
    { label: "Grades", href: "/teacher/grades", icon: Award },
];

const studentNav: NavItem[] = [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "Assignments", href: "/student/assignments", icon: BookOpen },
    { label: "Attendance", href: "/student/attendance", icon: ClipboardList },
    { label: "Grades", href: "/student/grades", icon: Award },
    { label: "Notifications", href: "/student/notifications", icon: Bell },
];

const parentNav: NavItem[] = [
    { label: "Dashboard", href: "/parent", icon: LayoutDashboard },
    { label: "Child Progress", href: "/parent/child-progress", icon: Users },
    { label: "Attendance", href: "/parent/attendance", icon: ClipboardList },
    { label: "Grades", href: "/parent/grades", icon: Award },
    { label: "Notifications", href: "/parent/notifications", icon: Bell },
];

const navMap: Record<string, NavItem[]> = {
    teacher: teacherNav,
    student: studentNav,
    parent: parentNav,
};

const roleLabels: Record<string, string> = {
    teacher: "Teacher Portal",
    student: "Student Portal",
    parent: "Parent Portal",
};

const roleColors: Record<string, string> = {
    teacher: "from-emerald-700 to-emerald-900",
    student: "from-blue-700 to-blue-900",
    parent: "from-violet-700 to-violet-900",
};

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: "teacher" | "student" | "parent";
    userName: string;
}

export default function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const navItems = navMap[role];

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b ${roleColors[role]} z-30 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex md:shrink-0`}>
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">Flora Public</p>
                            <p className="text-white/60 text-xs">{roleLabels[role]}</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? "bg-white/20 text-white"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span>{item.label}</span>
                                {isActive && <ChevronRight className="h-3 w-3 ml-auto opacity-60" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center space-x-3 mb-3 px-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {userName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{userName}</p>
                            <p className="text-white/50 text-xs capitalize">{role}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full flex items-center space-x-2 px-4 py-2.5 text-white/70 hover:bg-white/10 hover:text-white rounded-xl text-sm font-medium transition-all"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <h1 className="text-base font-bold text-slate-800 md:text-lg">{roleLabels[role]}</h1>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-500 hidden sm:block">{userName}</span>
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {userName.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile close button when sidebar open */}
            {sidebarOpen && (
                <button
                    className="fixed top-4 right-4 z-40 md:hidden p-2 bg-white rounded-full shadow-lg"
                    onClick={() => setSidebarOpen(false)}
                >
                    <X className="h-5 w-5 text-slate-700" />
                </button>
            )}
        </div>
    );
}
