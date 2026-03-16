import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
    GraduationCap,
    BookOpen,
    Download,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
    const session = await auth();
    const name = session?.user?.name ?? "Admin";

    // --- Real DB counts ---
    const [
        totalAdmissions,
        pendingAdmissions,
        approvedAdmissions,
        totalAnnouncements,
        totalEvents,
        totalGallery,
        totalDownloads,
        totalTeachers,
        totalStudents,
        totalParents,
        recentAdmissions,
    ] = await Promise.all([
        prisma.admission.count(),
        prisma.admission.count({ where: { status: "PENDING" } }),
        prisma.admission.count({ where: { status: "APPROVED" } }),
        prisma.announcement.count(),
        prisma.event.count({ where: { eventDate: { gte: new Date() } } }),
        prisma.galleryItem.count(),
        prisma.downloadFile.count(),
        prisma.teacher.count(),
        prisma.student.count(),
        prisma.parent.count(),
        prisma.admission.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    const stats = [
        { title: "Total Admissions", value: totalAdmissions, icon: Users, iconColor: "text-blue-600", iconBg: "bg-blue-100", badge: pendingAdmissions > 0 ? `${pendingAdmissions} pending` : undefined },
        { title: "Announcements", value: totalAnnouncements, icon: Megaphone, iconColor: "text-amber-600", iconBg: "bg-amber-100" },
        { title: "Upcoming Events", value: totalEvents, icon: CalendarDays, iconColor: "text-green-600", iconBg: "bg-green-100" },
        { title: "Gallery Items", value: totalGallery, icon: Image, iconColor: "text-purple-600", iconBg: "bg-purple-100" },
        { title: "Downloads", value: totalDownloads, icon: Download, iconColor: "text-slate-600", iconBg: "bg-slate-100" },
        { title: "Teachers", value: totalTeachers, icon: BookOpen, iconColor: "text-emerald-600", iconBg: "bg-emerald-100" },
        { title: "Students", value: totalStudents, icon: GraduationCap, iconColor: "text-indigo-600", iconBg: "bg-indigo-100" },
        { title: "Parents", value: totalParents, icon: Users, iconColor: "text-pink-600", iconBg: "bg-pink-100" },
    ];

    const quickActions = [
        { label: "New Admission", href: "/admin/admissions", icon: Users, color: "bg-blue-500 hover:bg-blue-600" },
        { label: "Add Announcement", href: "/admin/announcements", icon: Megaphone, color: "bg-amber-500 hover:bg-amber-600" },
        { label: "Add Event", href: "/admin/events", icon: CalendarDays, color: "bg-green-500 hover:bg-green-600" },
        { label: "Upload Gallery", href: "/admin/gallery", icon: Image, color: "bg-purple-500 hover:bg-purple-600" },
    ];

    const statusColor: Record<string, string> = {
        PENDING: "bg-amber-400",
        APPROVED: "bg-green-500",
        REJECTED: "bg-red-500",
    };

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
                            {pendingAdmissions > 0 && (
                                <span className="text-amber-300 font-bold">{pendingAdmissions} pending admission{pendingAdmissions > 1 ? "s" : ""} need review · </span>
                            )}
                            {totalStudents} students · {totalTeachers} teachers
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

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <StatsCard key={s.title} {...s} trend={undefined} trendLabel={undefined} />
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

            {/* Recent Admissions */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <h3 className="text-base font-extrabold text-slate-900">Recent Admissions</h3>
                    </div>
                    <Link href="/admin/admissions" className="text-sm text-primary font-bold flex items-center hover:underline">
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>
                {recentAdmissions.length === 0 ? (
                    <div className="px-6 py-12 text-center text-slate-400">No admissions yet.</div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {recentAdmissions.map((a) => (
                            <div key={a.id} className="flex items-center space-x-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                                <div className={`w-2.5 h-2.5 rounded-full ${statusColor[a.status] ?? "bg-slate-400"} shrink-0`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{a.studentName}</p>
                                    <p className="text-xs text-slate-400">Grade {a.grade} · {a.parentName}</p>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                    a.status === "APPROVED" ? "bg-green-50 text-green-700" :
                                    a.status === "REJECTED" ? "bg-red-50 text-red-700" :
                                    "bg-amber-50 text-amber-700"
                                }`}>{a.status}</span>
                                <span className="text-xs text-slate-400 shrink-0">{new Date(a.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* People Summary */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Approved Admissions", value: approvedAdmissions, href: "/admin/admissions?status=APPROVED", color: "text-green-600" },
                    { label: "Pending Review", value: pendingAdmissions, href: "/admin/admissions?status=PENDING", color: "text-amber-600" },
                    { label: "Active Students", value: totalStudents, href: "/admin/students", color: "text-indigo-600" },
                ].map(s => (
                    <Link key={s.label} href={s.href} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow text-center">
                        <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                        <p className="text-slate-500 text-sm mt-1">{s.label}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
