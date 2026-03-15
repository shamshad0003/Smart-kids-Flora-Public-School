"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createAssignment } from "../actions";
import { Plus, BookOpen, X } from "lucide-react";
import DeleteAssignmentButton from "./DeleteAssignmentButton";

type Course = { id: string; name: string; subject: string };
type Assignment = { id: string; title: string; description: string; dueDate: Date; courseId: string; course: Course };

export default function TeacherAssignmentsClient({ assignments, courses }: { assignments: Assignment[]; courses: Course[] }) {
    const [showForm, setShowForm] = useState(false);
    const [state, formAction, isPending] = useActionState(createAssignment, { success: false, message: "" });
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) { setShowForm(false); formRef.current?.reset(); }
    }, [state?.success]);

    return (
        <div className="space-y-6">
            {/* Create Button */}
            <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
            >
                {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span>{showForm ? "Cancel" : "New Assignment"}</span>
            </button>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Create Assignment</h2>
                    {state?.message && (
                        <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${state.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                            {state.message}
                        </div>
                    )}
                    <form ref={formRef} action={formAction} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold text-slate-700 mb-1 block">Title *</label>
                                <input name="title" required placeholder="Assignment title" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 mb-1 block">Course *</label>
                                <select name="courseId" required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500">
                                    <option value="">Select course</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-1 block">Description</label>
                            <textarea name="description" rows={3} placeholder="Assignment description..." className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500 resize-none" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-1 block">Due Date *</label>
                            <input type="date" name="dueDate" required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500" />
                        </div>
                        <button type="submit" disabled={isPending} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                            {isPending ? "Creating..." : "Create Assignment"}
                        </button>
                    </form>
                </div>
            )}

            {/* Assignments List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">All Assignments ({assignments.length})</h2>
                </div>
                {assignments.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium">No assignments yet. Create your first one!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {assignments.map((a) => (
                            <div key={a.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex-1 min-w-0 mr-4">
                                    <p className="font-semibold text-slate-800 truncate">{a.title}</p>
                                    <p className="text-sm text-slate-500">{a.course.name}</p>
                                    {a.description && <p className="text-xs text-slate-400 mt-1 truncate">{a.description}</p>}
                                </div>
                                <div className="flex items-center space-x-3 shrink-0">
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${new Date(a.dueDate) >= new Date() ? "text-amber-700 bg-amber-50 border-amber-200" : "text-slate-500 bg-slate-50 border-slate-200"}`}>
                                        {new Date(a.dueDate) >= new Date() ? "Due: " : "Past: "}{new Date(a.dueDate).toLocaleDateString()}
                                    </span>
                                    <DeleteAssignmentButton id={a.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
