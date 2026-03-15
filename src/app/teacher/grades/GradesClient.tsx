"use client";

import { useActionState, useState } from "react";
import { saveGrade } from "../actions";
import { Award } from "lucide-react";
import DeleteGradeButton from "./DeleteGradeButton";

type Student = { id: string; fullName: string; gradeLevel: string };
type Assignment = { id: string; title: string };
type GradeRecord = { id: string; studentId: string; marks: number; gradeLabel: string; remarks?: string | null; student: Student; assignment?: Assignment | null };
type Course = { id: string; name: string; gradeLevel: string; assignments: Assignment[]; grades: GradeRecord[] };

const gradeBadge: Record<string, string> = {
    A: "bg-green-50 text-green-700 border-green-200",
    B: "bg-blue-50 text-blue-700 border-blue-200",
    C: "bg-amber-50 text-amber-700 border-amber-200",
    D: "bg-orange-50 text-orange-700 border-orange-200",
    F: "bg-red-50 text-red-700 border-red-200",
};

export default function GradesClient({ courses, students }: { courses: Course[]; students: Student[] }) {
    const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id ?? "");
    const [state, formAction, isPending] = useActionState(saveGrade, { success: false, message: "" });
    const course = courses.find(c => c.id === selectedCourse);

    return (
        <div className="space-y-6">
            {/* Course selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <label className="text-sm font-bold text-slate-700 block mb-2">Select Course</label>
                <select
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                    className="w-full max-w-sm p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500"
                >
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {/* Add Grade Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="font-bold text-slate-900 mb-4">Add Grade</h2>
                {state?.message && (
                    <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${state.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                        {state.message}
                    </div>
                )}
                <form action={formAction} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input type="hidden" name="courseId" value={selectedCourse} />
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Student *</label>
                        <select name="studentId" required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500">
                            <option value="">Select student</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Assignment (optional)</label>
                        <select name="assignmentId" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500">
                            <option value="">General/Course Grade</option>
                            {course?.assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Marks (0–100) *</label>
                        <input type="number" name="marks" min="0" max="100" required placeholder="e.g. 88" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Remarks</label>
                        <input name="remarks" placeholder="Optional feedback..." className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div className="flex items-end">
                        <button type="submit" disabled={isPending} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                            {isPending ? "Saving..." : "Save Grade"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Grades Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">Grade Records {course ? `— ${course.name}` : ""}</h2>
                </div>
                {!course || course.grades.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400">No grades recorded for this course yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Student</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Assignment</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Marks</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Grade</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Remarks</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {course.grades.map((g) => (
                                    <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-slate-800">{g.student.fullName}</td>
                                        <td className="px-6 py-3 text-slate-500">{g.assignment?.title ?? "General"}</td>
                                        <td className="px-6 py-3 font-bold text-slate-900">{g.marks}%</td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${gradeBadge[g.gradeLabel] ?? gradeBadge.C}`}>
                                                {g.gradeLabel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-slate-400 text-xs">{g.remarks ?? "—"}</td>
                                        <td className="px-6 py-3">
                                            <DeleteGradeButton id={g.id} />
                                        </td>
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
