import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, ClipboardList, Award, Bell } from "lucide-react";
import Link from "next/link";

export default async function ParentDashboard() {
    const session = await auth();
    const parent = await prisma.parent.findUnique({
        where: { email: session?.user?.email! },
        include: {
            children: {
                include: {
                    attendances: { orderBy: { date: "desc" }, take: 20 },
                    grades: { include: { course: true }, orderBy: { createdAt: "desc" }, take: 5 }
                }
            }
        }
    });

    if (!parent) redirect("/login");

    const child = parent.children[0]; // primary child

    const totalAtt = child?.attendances.length ?? 0;
    const presentAtt = child?.attendances.filter(a => a.status === "PRESENT").length ?? 0;
    const attendancePct = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 0;
    const avgMarks = child && child.grades.length > 0
        ? Math.round(child.grades.reduce((s, g) => s + g.marks, 0) / child.grades.length)
        : 0;

    return (
        <div className="space-y-8">
            {/* Banner */}
            <div className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-16 -right-16 w-64 h-64 border-4 border-white rounded-full"></div>
                </div>
                <div className="relative z-10">
                    <p className="text-violet-100/70 text-sm">Parent Dashboard</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Welcome, {parent.fullName} 👋</h1>
                    {child && <p className="text-violet-100/70 text-sm mt-2">Monitoring: {child.fullName} · {child.gradeLevel}</p>}
                </div>
            </div>

            {!child ? (
                <div className="bg-white rounded-2xl border border-slate-200 py-20 text-center">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No child linked to your account yet.</p>
                    <p className="text-slate-400 text-sm mt-1">Please contact the school administration.</p>
                </div>
            ) : (
                <>
                    {/* Child Info Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center space-x-5">
                        <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-700 font-extrabold text-2xl shrink-0">
                            {child.fullName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xl font-extrabold text-slate-900">{child.fullName}</p>
                            <p className="text-slate-500 text-sm">{child.gradeLevel} · {child.email}</p>
                        </div>
                        <div className="ml-auto flex space-x-4 text-center">
                            <div className="px-4">
                                <p className="text-2xl font-extrabold text-slate-900">{attendancePct}%</p>
                                <p className="text-xs text-slate-500">Attendance</p>
                            </div>
                            <div className="px-4 border-l border-slate-100">
                                <p className="text-2xl font-extrabold text-slate-900">{avgMarks}%</p>
                                <p className="text-xs text-slate-500">Avg. Marks</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Access</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Child Progress", href: "/parent/child-progress", icon: Users, color: "bg-violet-500" },
                                { label: "Attendance", href: "/parent/attendance", icon: ClipboardList, color: "bg-amber-500" },
                                { label: "Grades", href: "/parent/grades", icon: Award, color: "bg-blue-500" },
                                { label: "Notifications", href: "/parent/notifications", icon: Bell, color: "bg-emerald-500" },
                            ].map(item => (
                                <Link key={item.label} href={item.href} className={`${item.color} text-white rounded-2xl p-5 flex flex-col items-center space-y-2 hover:opacity-90 transition text-center`}>
                                    <item.icon className="h-6 w-6" />
                                    <span className="font-bold text-sm">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Grades Preview */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-bold text-slate-900">Recent Grades</h2>
                            <Link href="/parent/grades" className="text-sm text-violet-600 font-bold hover:underline">View All</Link>
                        </div>
                        {child.grades.length === 0 ? (
                            <p className="px-6 py-10 text-center text-slate-400">No grades available yet.</p>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {child.grades.map(g => (
                                    <div key={g.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <p className="font-medium text-slate-800">{g.course.name}</p>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-bold text-slate-900">{g.marks}%</span>
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-slate-50 text-slate-600 border-slate-200">{g.gradeLabel}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
