import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import SafeDate from "@/components/ui/SafeDate";

const statusConfig = {
    PRESENT: { label: "Present", color: "text-green-600", bg: "bg-green-50 border-green-200", icon: CheckCircle },
    ABSENT: { label: "Absent", color: "text-red-600", bg: "bg-red-50 border-red-200", icon: XCircle },
    LATE: { label: "Late", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Clock },
    EXCUSED: { label: "Excused", color: "text-purple-600", bg: "bg-purple-50 border-purple-200", icon: AlertCircle },
};

export default async function ParentAttendancePage() {
    const session = await auth();
    const parent = await prisma.parent.findUnique({
        where: { email: session?.user?.email! },
        include: {
            children: {
                include: {
                    attendances: {
                        include: { course: true },
                        orderBy: { date: "desc" }
                    }
                }
            }
        }
    });

    if (!parent) redirect("/login");
    const child = parent.children[0];

    const total = child?.attendances.length ?? 0;
    const present = child?.attendances.filter(a => a.status === "PRESENT").length ?? 0;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Attendance</h1>
                <p className="text-slate-500 text-sm mt-1">{child?.fullName}'s attendance records.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Attendance Rate", value: `${pct}%`, color: "bg-blue-50 border-blue-200 text-blue-700" },
                    { label: "Present", value: present, color: "bg-green-50 border-green-200 text-green-700" },
                    { label: "Absent/Late", value: total - present, color: "bg-red-50 border-red-200 text-red-700" },
                ].map(s => (
                    <div key={s.label} className={`${s.color} border rounded-2xl p-5 text-center`}>
                        <p className="text-2xl font-extrabold">{s.value}</p>
                        <p className="text-sm font-medium mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100"><h2 className="font-bold text-slate-900">Attendance History</h2></div>
                {!child || child.attendances.length === 0 ? (
                    <p className="px-6 py-12 text-center text-slate-400">No records yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Date</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Course</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Status</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {child.attendances.map(att => {
                                    const cfg = statusConfig[att.status as keyof typeof statusConfig] ?? statusConfig.PRESENT;
                                    return (
                                        <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 text-slate-700 text-xs"><SafeDate date={att.date} /></td>
                                            <td className="px-6 py-3 text-slate-600">{att.course.name}</td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color}`}>
                                                    <cfg.icon className="h-3 w-3" /><span>{cfg.label}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-slate-400 text-xs">{att.remarks ?? "—"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
