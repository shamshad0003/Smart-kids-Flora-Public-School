"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, Bell, Search, LogOut } from "lucide-react";

interface AdminHeaderProps {
    userName: string;
    onMobileMenuToggle: () => void;
}

// Derive a readable page title from the pathname
function getPageTitle(pathname: string): string {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1 && segments[0] === "admin") return "Dashboard";
    const last = segments[segments.length - 1];
    return last.charAt(0).toUpperCase() + last.slice(1);
}

export default function AdminHeader({ userName, onMobileMenuToggle }: AdminHeaderProps) {
    const pathname = usePathname();
    const pageTitle = getPageTitle(pathname);

    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
            {/* Left: mobile menu + breadcrumb */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={onMobileMenuToggle}
                    className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div>
                    <h2 className="text-lg font-extrabold text-slate-900 leading-none">{pageTitle}</h2>
                    <p className="text-xs text-slate-400 leading-tight hidden sm:block">
                        Smart Kids Flora Public School — Admin Portal
                    </p>
                </div>
            </div>

            {/* Right: search + notifications + user */}
            <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-3 py-2 space-x-2">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent text-sm outline-none text-slate-700 w-32 lg:w-48"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-black">
                        {userName.charAt(0)}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 leading-none">{userName}</p>
                        <p className="text-xs text-slate-400 leading-tight">Administrator</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition ml-1"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
