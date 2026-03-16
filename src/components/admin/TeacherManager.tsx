"use client";
import { useState, useTransition } from "react";
import { createTeacher, updateTeacher, deleteTeacher } from "@/app/admin/teachers/actions";
import { Plus, Pencil, Trash2, Loader2, X, BookOpen } from "lucide-react";

type Teacher = {
    id: string; fullName: string; email: string; phone: string | null; subject: string; createdAt: Date;
};

export default function TeacherManager({ teachers }: { teachers: Teacher[] }) {
    const [isPending, startTransition] = useTransition();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Teacher | null>(null);
    const [error, setError] = useState("");

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await createTeacher(fd) as { error?: string, success?: boolean };
            if (res?.error) setError(res.error);
            else { setShowForm(false); (e.target as HTMLFormElement).reset(); }
        });
    };

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await updateTeacher(fd) as { error?: string, success?: boolean };
            if (res?.error) setError(res.error);
            else setEditing(null);
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this teacher? This will also remove their login account.")) return;
        startTransition(async () => { await deleteTeacher(id); });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Teachers</h2>
                    <p className="text-slate-500 text-sm mt-1">{teachers.length} teacher{teachers.length !== 1 ? "s" : ""} registered</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); setError(""); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <Plus className="h-4 w-4" /> Add Teacher
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900">New Teacher</h3>
                        <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-slate-400" /></button>
                    </div>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {error && <div className="md:col-span-2 bg-red-50 text-red-700 rounded-xl px-4 py-2.5 text-sm">{error}</div>}
                        <input name="fullName" placeholder="Full Name *" required className="input-field" />
                        <input name="email" type="email" placeholder="Email Address *" required className="input-field" />
                        <input name="subject" placeholder="Subject (e.g. Mathematics) *" required className="input-field" />
                        <input name="phone" placeholder="Phone (optional)" className="input-field" />
                        <input name="password" type="password" placeholder="Password *" required minLength={8} className="input-field" />
                        <button type="submit" disabled={isPending}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60">
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Create Teacher
                        </button>
                    </form>
                </div>
            )}

            {/* Edit Form */}
            {editing && (
                <div className="bg-white border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900">Edit Teacher</h3>
                        <button onClick={() => setEditing(null)}><X className="h-5 w-5 text-slate-400" /></button>
                    </div>
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {error && <div className="md:col-span-2 bg-red-50 text-red-700 rounded-xl px-4 py-2.5 text-sm">{error}</div>}
                        <input type="hidden" name="id" value={editing.id} />
                        <input name="fullName" defaultValue={editing.fullName} placeholder="Full Name *" required className="input-field" />
                        <input name="subject" defaultValue={editing.subject} placeholder="Subject *" required className="input-field" />
                        <input name="phone" defaultValue={editing.phone ?? ""} placeholder="Phone" className="input-field" />
                        <button type="submit" disabled={isPending}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60">
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Changes
                        </button>
                    </form>
                </div>
            )}

            {/* Table */}
            {teachers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 px-6 py-16 text-center">
                    <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No teachers yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add your first teacher above</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {["Name", "Email", "Subject", "Phone", "Joined", "Actions"].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {teachers.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4 font-semibold text-slate-900">{t.fullName}</td>
                                    <td className="px-5 py-4 text-slate-500">{t.email}</td>
                                    <td className="px-5 py-4"><span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">{t.subject}</span></td>
                                    <td className="px-5 py-4 text-slate-500">{t.phone ?? "—"}</td>
                                    <td className="px-5 py-4 text-slate-400 text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => { setEditing(t); setShowForm(false); setError(""); }}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(t.id)} disabled={isPending}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
