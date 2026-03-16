"use client";
import { useState, useTransition } from "react";
import { createParent, updateParent, deleteParent } from "@/app/admin/parents/actions";
import { Plus, Pencil, Trash2, Loader2, X, Users } from "lucide-react";

type Parent = { id: string; fullName: string; email: string; phone: string | null; createdAt: Date; _count: { children: number } };

export default function ParentManager({ parents }: { parents: Parent[] }) {
    const [isPending, startTransition] = useTransition();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Parent | null>(null);
    const [error, setError] = useState("");

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); setError("");
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await createParent(fd) as { error?: string, success?: boolean };
            if (res?.error) setError(res.error);
            else { setShowForm(false); (e.target as HTMLFormElement).reset(); }
        });
    };

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); setError("");
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await updateParent(fd) as { error?: string, success?: boolean };
            if (res?.error) setError(res.error);
            else setEditing(null);
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this parent? This will also remove their login account.")) return;
        startTransition(async () => { await deleteParent(id); });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Parents</h2>
                    <p className="text-slate-500 text-sm mt-1">{parents.length} parent{parents.length !== 1 ? "s" : ""} registered</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); setError(""); }}
                    className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <Plus className="h-4 w-4" /> Add Parent
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900">New Parent</h3>
                        <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-slate-400" /></button>
                    </div>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {error && <div className="md:col-span-2 bg-red-50 text-red-700 rounded-xl px-4 py-2.5 text-sm">{error}</div>}
                        <input name="fullName" placeholder="Full Name *" required className="input-field" />
                        <input name="email" type="email" placeholder="Email Address *" required className="input-field" />
                        <input name="phone" placeholder="Phone (optional)" className="input-field" />
                        <input name="password" type="password" placeholder="Password *" required minLength={8} className="input-field" />
                        <button type="submit" disabled={isPending}
                            className="md:col-span-2 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-60">
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create Parent
                        </button>
                    </form>
                </div>
            )}

            {editing && (
                <div className="bg-white border border-pink-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900">Edit Parent</h3>
                        <button onClick={() => setEditing(null)}><X className="h-5 w-5 text-slate-400" /></button>
                    </div>
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {error && <div className="md:col-span-2 bg-red-50 text-red-700 rounded-xl px-4 py-2.5 text-sm">{error}</div>}
                        <input type="hidden" name="id" value={editing.id} />
                        <input name="fullName" defaultValue={editing.fullName} placeholder="Full Name *" required className="input-field" />
                        <input name="phone" defaultValue={editing.phone ?? ""} placeholder="Phone" className="input-field" />
                        <button type="submit" disabled={isPending}
                            className="md:col-span-2 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-60">
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Changes
                        </button>
                    </form>
                </div>
            )}

            {parents.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 px-6 py-16 text-center">
                    <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No parents yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add your first parent above</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {["Name", "Email", "Phone", "Children", "Joined", "Actions"].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {parents.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4 font-semibold text-slate-900">{p.fullName}</td>
                                    <td className="px-5 py-4 text-slate-500">{p.email}</td>
                                    <td className="px-5 py-4 text-slate-500">{p.phone ?? "—"}</td>
                                    <td className="px-5 py-4"><span className="bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full text-xs font-semibold">{p._count.children}</span></td>
                                    <td className="px-5 py-4 text-slate-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => { setEditing(p); setShowForm(false); setError(""); }}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} disabled={isPending}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
