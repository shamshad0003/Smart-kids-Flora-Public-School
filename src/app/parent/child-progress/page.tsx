import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, BookOpen, Award, ClipboardList } from "lucide-react";

export default async function ParentChildProgressPage() {
    const session = await auth();
    const parent = await prisma.parent.findUnique({
        where: { email: session?.user?.email! },
        include: {
            children: {
                include: {
                    grades: { include: { course: true } },
                    attendances: { include: { course: true } }
                }
            }
        }
    });

    if (!parent) redirect("/login");
    const child = parent.children[0];

    if (!child) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 py-20 text-center">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No child linked. Contact the school administration.</p>
            </div>
        );
    }

    const courses = await prisma.course.findMany({
        where: { gradeLevel: child.gradeLevel },
        include: {
            teacher: true,
            assignments: true,
        }
    });

    const totalAtt = child.attendances.length;
    const presentAtt = child.attendances.filter(a => a.status === "PRESENT").length;
    const attPct = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 0;
    const avgMarks = child.grades.length > 0
        ? (child.grades.reduce((s, g) => s + g.marks, 0) / child.grades.length).toFixed(1)
        : "N/A";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Child Progress</h1>
                <p className="text-slate-500 text-sm mt-1">Overview of {child.fullName}'s academic progress.</p>
            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Courses Enrolled", value: courses.length, icon: BookOpen, color: "bg-blue-50 text-blue-600 border-blue-200" },
                    { label: "Attendance Rate", value: `${attPct}%`, icon: ClipboardList, color: "bg-amber-50 text-amber-600 border-amber-200" },
                    { label: "Average Marks", value: `${avgMarks}${avgMarks !== "N/A" ? "%" : ""}`, icon: Award, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
                    { label: "Total Grades", value: child.grades.length, icon: Award, color: "bg-purple-50 text-purple-600 border-purple-200" },
                ].map(s => (
                    <div key={s.label} className={`bg-white border rounded-2xl ${s.color.split(" ")[2]} p-5`}>
                        <div className={`w-9 h-9 rounded-xl ${s.color.split(" ").slice(0, 2).join(" ")} flex items-center justify-center mb-3`}>
                            <s.icon className="h-4 w-4" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                        <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Courses */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">Enrolled Courses</h2>
                </div>
                <div className="divide-y divide-slate-50">
                    {courses.map(c => {
                        const courseGrades = child.grades.filter(g => g.courseId === c.id);
                        const avg = courseGrades.length > 0
                            ? Math.round(courseGrades.reduce((s, g) => s + g.marks, 0) / courseGrades.length)
                            : null;
                        return (
                            <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-slate-800">{c.name}</p>
                                    <p className="text-sm text-slate-500">Teacher: {c.teacher.fullName} · {c.assignments.length} assignments</p>
                                </div>
                                {avg !== null && (
                                    <span className="font-bold text-slate-900">{avg}%</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
