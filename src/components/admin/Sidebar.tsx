"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Users,
    Megaphone,
    CalendarDays,
    Image,
    Download,
    Settings,
    LogOut,
    GraduationCap,
    ChevronLeft,
    Menu,
    BookOpen,
    Bell,
    UserCheck,
} from "lucide-react";

const navGroups = [
    {
        label: "Main",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        ],
    },
    {
        label: "Content",
        items: [
            { name: "Admissions", href: "/admin/admissions", icon: Users },
            { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
            { name: "Events", href: "/admin/events", icon: CalendarDays },
            { name: "Gallery", href: "/admin/gallery", icon: Image },
            { name: "Downloads", href: "/admin/downloads", icon: Download },
            { name: "Notifications", href: "/admin/notifications", icon: Bell },
        ],
    },
    {
        label: "People",
        items: [
            { name: "Teachers", href: "/admin/teachers", icon: BookOpen },
            { name: "Students", href: "/admin/students", icon: GraduationCap },
            { name: "Parents", href: "/admin/parents", icon: UserCheck },
        ],
    },
    {
        label: "System",
        items: [
            { name: "Settings", href: "/admin/settings", icon: Settings },
        ],
    },
];


interface SidebarProps {
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    const renderSidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`flex items-center p-5 border-b border-white/10 ${collapsed ? "justify-center" : "justify-between"}`}>
                {!collapsed && (
                    <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-primary shadow">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-white font-extrabold leading-none text-sm">Flora Admin</p>
                            <p className="text-white/40 text-xs leading-tight">School Portal</p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-primary shadow">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                    <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navGroups.map((group) => (
                    <div key={group.label}>
                        {!collapsed && (
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 py-2 mt-2 first:mt-0">
                                {group.label}
                            </p>
                        )}
                        {group.items.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onMobileClose}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all group ${isActive(item.href)
                                        ? "bg-white/15 text-white shadow-inner"
                                        : "text-white/60 hover:bg-white/10 hover:text-white"
                                    } ${collapsed ? "justify-center" : ""}`}
                                title={collapsed ? item.name : undefined}
                            >
                                <item.icon className={`h-5 w-5 shrink-0 ${isActive(item.href) ? "text-secondary" : ""}`} />
                                {!collapsed && (
                                    <span className="text-sm font-semibold">{item.name}</span>
                                )}
                                {!collapsed && isActive(item.href) && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                )}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>


            {/* Logout */}
            <div className="p-3 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all ${collapsed ? "justify-center" : ""
                        }`}
                    title={collapsed ? "Logout" : undefined}
                >
                    <LogOut className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="text-sm font-semibold">Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col bg-slate-900 transition-all duration-300 shrink-0 ${collapsed ? "w-20" : "w-64"
                    }`}
            >
                {renderSidebarContent()}
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-slate-900 z-50 transform transition-transform duration-300 lg:hidden flex flex-col ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-primary">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <span className="text-white font-extrabold text-sm">Flora Admin</span>
                    </div>
                    <button onClick={onMobileClose} className="text-white/50 hover:text-white p-1">
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {renderSidebarContent()}
                </div>
            </aside>
        </>
    );
}
