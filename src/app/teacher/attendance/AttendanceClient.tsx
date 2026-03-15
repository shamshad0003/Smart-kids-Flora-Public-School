"use client";

import { useActionState, useState } from "react";
import { markAttendance } from "../actions";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

type Student = { id: string; fullName: string; gradeLevel: string };
type AttendanceRecord = { id: string; studentId: string; status: string; date: Date; remarks?: string | null; student: Student };
type Course = { id: string; name: string; gradeLevel: string; attendances: AttendanceRecord[] };

const statusConfig = {
    PRESENT: { label: "Present", color: "text-green-600", bg: "bg-green-50 border-green-200", icon: CheckCircle },
    ABSENT: { label: "Absent", color: "text-red-600", bg: "bg-red-50 border-red-200", icon: XCircle },
    LATE: { label: "Late", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Clock },
    EXCUSED: { label: "Excused", color: "text-purple-600", bg: "bg-purple-50 border-purple-200", icon: AlertCircle },
};

export default function AttendanceClient({ courses, students }: { courses: Course[]; students: Student[] }) {
    const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id ?? "");
    const [state, formAction, isPending] = useActionState(markAttendance, { success: false, message: "" });

    const course = courses.find(c => c.id === selectedCourse);
    const todayStr = new Date().toISOString().split("T")[0];

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

            {/* Mark Attendance Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="font-bold text-slate-900 mb-4">Mark Attendance</h2>
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
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Date *</label>
                        <input type="date" name="date" required defaultValue={todayStr} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Status *</label>
                        <select name="status" required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500">
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LATE">Late</option>
                            <option value="EXCUSED">Excused</option>
                        </select>
                    </div>
                    <div className="lg:col-span-2">
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Remarks</label>
                        <input name="remarks" placeholder="Optional notes..." className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div className="flex items-end">
                        <button type="submit" disabled={isPending} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                            {isPending ? "Saving..." : "Save Attendance"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Attendance Records */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">Recent Records {course ? `— ${course.name}` : ""}</h2>
                </div>
                {!course || course.attendances.length === 0 ? (
                    <div className="px-6 py-12 text-center text-slate-400">No attendance records yet for this course.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Student</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Date</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Status</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-semibold">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {course.attendances.map((att) => {
                                    const cfg = statusConfig[att.status as keyof typeof statusConfig] ?? statusConfig.PRESENT;
                                    return (
                                        <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-slate-800">{att.student.fullName}</td>
                                            <td className="px-6 py-3 text-slate-600">{new Date(att.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color}`}>
                                                    <cfg.icon className="h-3 w-3" />
                                                    <span>{cfg.label}</span>
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
