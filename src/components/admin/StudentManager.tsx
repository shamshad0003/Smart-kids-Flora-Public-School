"use client";
import { useState, useTransition } from "react";
import { createStudent, updateStudent, deleteStudent } from "@/app/admin/students/actions";
import { Plus, Pencil, Trash2, Loader2, X, GraduationCap } from "lucide-react";

type Student = {
    id: string; fullName: string; email: string; phone: string | null;
    gradeLevel: string; parentId: string | null; createdAt: Date;
};
type Parent = { id: string; fullName: string; };

export default function StudentManager({ students, parents }: { students: Student[]; parents: Parent[] }) {
    const [isPending, startTransition] = useTransition();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Student | null>(null);
    const [error, setError] = useState("");

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); setError("");
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await createStudent(fd) as { error?: string, success?: boolean };
            if (res?.error) setError(res.error);
            else { setShowForm(false); (e.target as HTMLFormElement).reset(); }
        });
    };

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); setError("");
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await updateStudent(fd) as { error?: string, success?: boolean };
            if (res?.error) setError(res.error);
            else setEditing(null);
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this student? This will also remove their login account and all academic records.")) return;
        startTransition(async () => { await deleteStudent(id); });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Students</h2>
                    <p className="text-slate-500 text-sm mt-1">{students.length} student{students.length !== 1 ? "s" : ""} enrolled</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); setError(""); }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <Plus className="h-4 w-4" /> Add Student
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900">New Student</h3>
                        <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-slate-400" /></button>
                    </div>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {error && <div className="md:col-span-2 bg-red-50 text-red-700 rounded-xl px-4 py-2.5 text-sm">{error}</div>}
                        <input name="fullName" placeholder="Full Name *" required className="input-field" />
                        <input name="email" type="email" placeholder="Email Address *" required className="input-field" />
                        <input name="gradeLevel" placeholder="Grade Level (e.g. Class 8) *" required className="input-field" />
                        <input name="phone" placeholder="Phone (optional)" className="input-field" />
                        <input name="password" type="password" placeholder="Password *" required minLength={8} className="input-field" />
                        <select name="parentId" className="input-field text-slate-600">
                            <option value="">No Parent Linked</option>
                            {parents.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                        </select>
                        <button type="submit" disabled={isPending}
                            className="md:col-span-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-60">
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create Student
                        </button>
                    </form>
                </div>
            )}

            {editing && (
                <div className="bg-white border border-indigo-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900">Edit Student</h3>
                        <button onClick={() => setEditing(null)}><X className="h-5 w-5 text-slate-400" /></button>
                    </div>
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {error && <div className="md:col-span-2 bg-red-50 text-red-700 rounded-xl px-4 py-2.5 text-sm">{error}</div>}
                        <input type="hidden" name="id" value={editing.id} />
                        <input name="fullName" defaultValue={editing.fullName} placeholder="Full Name *" required className="input-field" />
                        <input name="gradeLevel" defaultValue={editing.gradeLevel} placeholder="Grade Level *" required className="input-field" />
                        <input name="phone" defaultValue={editing.phone ?? ""} placeholder="Phone" className="input-field" />
                        <select name="parentId" defaultValue={editing.parentId ?? ""} className="input-field text-slate-600">
                            <option value="">No Parent Linked</option>
                            {parents.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                        </select>
                        <button type="submit" disabled={isPending}
                            className="md:col-span-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-60">
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Changes
                        </button>
                    </form>
                </div>
            )}

            {students.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 px-6 py-16 text-center">
                    <GraduationCap className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No students yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add your first student above</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {["Name", "Email", "Grade", "Parent", "Phone", "Joined", "Actions"].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.map((s) => {
                                const parent = parents.find(p => p.id === s.parentId);
                                return (
                                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-4 font-semibold text-slate-900">{s.fullName}</td>
                                        <td className="px-5 py-4 text-slate-500">{s.email}</td>
                                        <td className="px-5 py-4"><span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-semibold">{s.gradeLevel}</span></td>
                                        <td className="px-5 py-4 text-slate-500">{parent?.fullName ?? <span className="text-slate-300">—</span>}</td>
                                        <td className="px-5 py-4 text-slate-500">{s.phone ?? "—"}</td>
                                        <td className="px-5 py-4 text-slate-400 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => { setEditing(s); setShowForm(false); setError(""); }}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(s.id)} disabled={isPending}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
