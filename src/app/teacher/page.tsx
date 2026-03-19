import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BookOpen, Users, ClipboardList, Award, TrendingUp } from "lucide-react";
import Link from "next/link";
import SafeDate from "@/components/ui/SafeDate";

export default async function TeacherDashboard() {
    const session = await auth();
    const userEmail = session?.user?.email!;

    const teacher = await prisma.teacher.findUnique({
        where: { email: userEmail },
        include: {
            courses: {
                include: {
                    assignments: true,
                    attendances: true,
                    _count: { select: { attendances: true } }
                }
            },
            assignments: {
                orderBy: { dueDate: "asc" },
                take: 5,
                include: { course: true }
            }
        }
    });

    if (!teacher) redirect("/login");

    const totalCourses = teacher.courses.length;
    const totalAssignments = teacher.assignments.length;
    const totalAttendanceRecords = teacher.courses.reduce((sum, c) => sum + c._count.attendances, 0);
    const upcomingAssignments = teacher.assignments.filter(a => new Date(a.dueDate) >= new Date());

    const stats = [
        { label: "My Courses", value: totalCourses, icon: BookOpen, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-200" },
        { label: "Assignments", value: totalAssignments, icon: ClipboardList, color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
        { label: "Attendance Records", value: totalAttendanceRecords, icon: Users, color: "bg-amber-50 text-amber-600", border: "border-amber-200" },
        { label: "Upcoming Due", value: upcomingAssignments.length, icon: TrendingUp, color: "bg-purple-50 text-purple-600", border: "border-purple-200" },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-16 -right-16 w-64 h-64 border-4 border-white rounded-full"></div>
                </div>
                <div className="relative z-10">
                    <p className="text-emerald-100/70 text-sm">Welcome back,</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">{teacher.fullName} 👋</h1>
                    <p className="text-emerald-100/70 text-sm mt-2">Subject: {teacher.subject}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className={`bg-white rounded-2xl border ${stat.border} p-5 flex flex-col space-y-3`}>
                        <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                            <p className="text-slate-500 text-sm">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Manage Assignments", href: "/teacher/assignments", icon: BookOpen, color: "bg-blue-500" },
                        { label: "Mark Attendance", href: "/teacher/attendance", icon: ClipboardList, color: "bg-amber-500" },
                        { label: "Enter Grades", href: "/teacher/grades", icon: Award, color: "bg-purple-500" },
                    ].map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className={`${action.color} text-white rounded-2xl p-5 flex items-center space-x-3 hover:opacity-90 transition-opacity`}
                        >
                            <div className="p-2 bg-white/20 rounded-xl"><action.icon className="h-5 w-5" /></div>
                            <span className="font-bold">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Upcoming Assignments */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900">Upcoming Assignments</h2>
                    <Link href="/teacher/assignments" className="text-sm text-emerald-600 font-bold hover:underline">View All</Link>
                </div>
                {upcomingAssignments.length === 0 ? (
                    <div className="px-6 py-10 text-center text-slate-400">No upcoming assignments.</div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {upcomingAssignments.map((a) => (
                            <div key={a.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-slate-800">{a.title}</p>
                                    <p className="text-sm text-slate-500">{a.course.name}</p>
                                </div>
                                <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                                    Due: <SafeDate date={a.dueDate} />
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
