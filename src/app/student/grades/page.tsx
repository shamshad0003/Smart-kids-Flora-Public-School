import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Award } from "lucide-react";

const gradeBadge: Record<string, string> = {
    A: "bg-green-50 text-green-700 border-green-200",
    B: "bg-blue-50 text-blue-700 border-blue-200",
    C: "bg-amber-50 text-amber-700 border-amber-200",
    D: "bg-orange-50 text-orange-700 border-orange-200",
    F: "bg-red-50 text-red-700 border-red-200",
};

export default async function StudentGradesPage() {
    const session = await auth();
    const student = await prisma.student.findUnique({
        where: { email: session?.user?.email! },
        include: {
            grades: {
                include: { course: true, assignment: true },
                orderBy: { createdAt: "desc" }
            }
        }
    });
    if (!student) redirect("/login");

    const avgMarks = student.grades.length > 0
        ? (student.grades.reduce((s, g) => s + g.marks, 0) / student.grades.length).toFixed(1)
        : "N/A";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">My Grades</h1>
                <p className="text-slate-500 text-sm mt-1">View all your academic grades.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm text-blue-600 font-medium">Average Score</p>
                    <p className="text-2xl font-extrabold text-blue-900">{avgMarks}{avgMarks !== "N/A" ? "%" : ""}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">All Grades ({student.grades.length})</h2>
                </div>
                {student.grades.length === 0 ? (
                    <p className="px-6 py-12 text-center text-slate-400">No grades recorded yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Course</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Assignment</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Marks</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Grade</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {student.grades.map(g => (
                                    <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-slate-800">{g.course.name}</td>
                                        <td className="px-6 py-3 text-slate-500">{g.assignment?.title ?? "General"}</td>
                                        <td className="px-6 py-3 font-bold text-slate-900">{g.marks}%</td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${gradeBadge[g.gradeLabel] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>{g.gradeLabel}</span>
                                        </td>
                                        <td className="px-6 py-3 text-slate-400 text-xs">{g.remarks ?? "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
