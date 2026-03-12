import React from "react";
import { auth } from "@/lib/auth";
import StatsCard from "@/components/admin/StatsCard";
import {
    Users,
    Megaphone,
    CalendarDays,
    Image,
    PlusCircle,
    Bell,
    ArrowRight,
    Clock,
} from "lucide-react";
import Link from "next/link";

// Demo summary data — replace with real DB queries in Phase 3
const stats = [
    {
        title: "Total Admissions",
        value: 312,
        icon: Users,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
        trend: 12,
        trendLabel: "vs. last month",
    },
    {
        title: "Announcements",
        value: 24,
        icon: Megaphone,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-100",
        trend: 5,
        trendLabel: "vs. last month",
    },
    {
        title: "Upcoming Events",
        value: 8,
        icon: CalendarDays,
        iconColor: "text-green-600",
        iconBg: "bg-green-100",
        trend: -2,
        trendLabel: "vs. last month",
    },
    {
        title: "Gallery Items",
        value: 156,
        icon: Image,
        iconColor: "text-purple-600",
        iconBg: "bg-purple-100",
        trend: 0,
        trendLabel: "No change",
    },
];

// Demo recent activity
const recentActivity = [
    { type: "Admission", name: "Ali Hassan enrolled in Class 5", time: "2 hours ago", color: "bg-blue-500" },
    { type: "Announcement", name: "Annual Sports Meet date announced", time: "5 hours ago", color: "bg-amber-500" },
    { type: "Event", name: "Science Fair added to calendar", time: "Yesterday", color: "bg-green-500" },
    { type: "Gallery", name: "12 photos added to Sports Day album", time: "Yesterday", color: "bg-purple-500" },
    { type: "Admission", name: "Zara Khan enrolled in Class 3", time: "2 days ago", color: "bg-blue-500" },
];

const quickActions = [
    { label: "New Admission", href: "/admin/admissions", icon: Users, color: "bg-blue-500 hover:bg-blue-600" },
    { label: "Add Announcement", href: "/admin/announcements", icon: Megaphone, color: "bg-amber-500 hover:bg-amber-600" },
    { label: "Add Event", href: "/admin/events", icon: CalendarDays, color: "bg-green-500 hover:bg-green-600" },
    { label: "Upload Gallery", href: "/admin/gallery", icon: Image, color: "bg-purple-500 hover:bg-purple-600" },
];

export default async function AdminDashboardPage() {
    const session = await auth();
    const name = session?.user?.name ?? "Admin";

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary to-blue-700 rounded-3xl p-6 md:p-8 text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-16 -right-16 w-64 h-64 border-4 border-white rounded-full"></div>
                    <div className="absolute -bottom-8 right-32 w-32 h-32 border-4 border-white rounded-full"></div>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-blue-100/70 text-sm font-medium">Welcome back,</p>
                        <h1 className="text-3xl font-extrabold text-white">{name} 👋</h1>
                        <p className="text-blue-100/70 text-sm">
                            Here&apos;s what&apos;s happening at Smart Kids Flora Public School today.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 rounded-xl px-4 py-3 text-sm text-blue-100/80 border border-white/10 self-start md:self-center">
                        <Clock className="h-4 w-4" />
                        <span>
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((s) => (
                    <StatsCard key={s.title} {...s} />
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className={`${action.color} text-white rounded-2xl p-5 flex flex-col items-start space-y-3 transition-all hover:shadow-lg hover:-translate-y-0.5`}
                        >
                            <div className="p-2 bg-white/20 rounded-xl">
                                <action.icon className="h-5 w-5" />
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <span className="text-sm font-bold">{action.label}</span>
                                <PlusCircle className="h-4 w-4 opacity-70" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <h3 className="text-base font-extrabold text-slate-900">Recent Activity</h3>
                    </div>
                    <Link href="/admin/admissions" className="text-sm text-primary font-bold flex items-center hover:underline">
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>
                <div className="divide-y divide-slate-50">
                    {recentActivity.map((item, i) => (
                        <div key={i} className="flex items-center space-x-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                            <div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`}></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                                <p className="text-xs text-slate-400">{item.type}</p>
                            </div>
                            <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
