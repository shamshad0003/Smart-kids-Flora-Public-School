import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BookOpen, ClipboardList, Award, Bell, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function StudentDashboard() {
    const session = await auth();
    const student = await prisma.student.findUnique({
        where: { email: session?.user?.email! },
        include: {
            attendances: { orderBy: { date: "desc" }, take: 20 },
            grades: { include: { course: true, assignment: true }, orderBy: { createdAt: "desc" }, take: 5 }
        }
    });

    if (!student) redirect("/login");

    const totalAttendance = student.attendances.length;
    const presentCount = student.attendances.filter(a => a.status === "PRESENT").length;
    const attendancePct = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;
    const avgMarks = student.grades.length > 0
        ? Math.round(student.grades.reduce((sum, g) => sum + g.marks, 0) / student.grades.length)
        : 0;

    const stats = [
        { label: "Attendance", value: `${attendancePct}%`, icon: ClipboardList, color: "bg-blue-50 text-blue-600 border-blue-200" },
        { label: "Average Marks", value: `${avgMarks}%`, icon: Award, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
        { label: "Grades Recorded", value: student.grades.length, icon: TrendingUp, color: "bg-purple-50 text-purple-600 border-purple-200" },
    ];

    const gradeBadge: Record<string, string> = {
        A: "bg-green-50 text-green-700 border-green-200",
        B: "bg-blue-50 text-blue-700 border-blue-200",
        C: "bg-amber-50 text-amber-700 border-amber-200",
        D: "bg-orange-50 text-orange-700 border-orange-200",
        F: "bg-red-50 text-red-700 border-red-200",
    };

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-16 -right-16 w-64 h-64 border-4 border-white rounded-full"></div>
                </div>
                <div className="relative z-10">
                    <p className="text-blue-100/70 text-sm">Welcome back,</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">{student.fullName} 👋</h1>
                    <p className="text-blue-100/70 text-sm mt-2">Class: {student.gradeLevel}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className={`bg-white rounded-2xl border ${s.color.split(" ")[2]} p-5 flex items-center space-x-4`}>
                        <div className={`w-12 h-12 rounded-xl ${s.color.split(" ").slice(0, 2).join(" ")} flex items-center justify-center shrink-0`}>
                            <s.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                            <p className="text-slate-500 text-sm">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">My Sections</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Assignments", href: "/student/assignments", icon: BookOpen, color: "bg-blue-500" },
                        { label: "Attendance", href: "/student/attendance", icon: ClipboardList, color: "bg-amber-500" },
                        { label: "Grades", href: "/student/grades", icon: Award, color: "bg-purple-500" },
                        { label: "Notifications", href: "/student/notifications", icon: Bell, color: "bg-emerald-500" },
                    ].map((item) => (
                        <Link key={item.label} href={item.href} className={`${item.color} text-white rounded-2xl p-5 flex flex-col items-center space-y-2 hover:opacity-90 transition-opacity text-center`}>
                            <item.icon className="h-6 w-6" />
                            <span className="font-bold text-sm">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Grades */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900">Recent Grades</h2>
                    <Link href="/student/grades" className="text-sm text-blue-600 font-bold hover:underline">View All</Link>
                </div>
                {student.grades.length === 0 ? (
                    <div className="px-6 py-12 text-center text-slate-400">No grades recorded yet.</div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {student.grades.map((g) => (
                            <div key={g.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-slate-800">{g.assignment?.title ?? "General Grade"}</p>
                                    <p className="text-sm text-slate-500">{g.course.name}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="font-bold text-slate-900">{g.marks}%</span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${gradeBadge[g.gradeLabel] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>{g.gradeLabel}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
