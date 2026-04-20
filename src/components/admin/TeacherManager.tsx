"use client";
import { useState, useTransition } from "react";
import { createTeacher, updateTeacher, deleteTeacher, toggleTeacherStatus } from "@/app/admin/teachers/actions";
import { resetUserPassword } from "@/app/actions/user";
import { Plus, Pencil, Trash2, Loader2, X, BookOpen, ShieldCheck, UserCheck, UserX, Copy, CheckCircle2, KeyRound } from "lucide-react";

type Teacher = {
    id: string; 
    userId: string; // Added userId
    fullName: string; 
    email: string; 
    phone: string | null; 
    subject: string; 
    createdAt: Date;
    isActive?: boolean;
};

export default function TeacherManager({ teachers }: { teachers: Teacher[] }) {
    const [isPending, startTransition] = useTransition();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Teacher | null>(null);
    const [error, setError] = useState("");
    const [newAccountInfo, setNewAccountInfo] = useState<{email: string, tempPass: string} | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        const fd = new FormData(e.currentTarget);
        const email = fd.get("email") as string;
        
        startTransition(async () => {
            const res = await createTeacher(fd) as { error?: string, success?: boolean, tempPassword?: string };
            if (res?.error) setError(res.error as string);
            else { 
                if (res.tempPassword) {
                    setNewAccountInfo({ email, tempPass: res.tempPassword });
                }
                setShowForm(false); 
                (e.target as HTMLFormElement).reset(); 
            }
        });
    };

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await updateTeacher(fd) as { error?: string, success?: boolean };
            if (res?.error) setError(typeof res.error === 'string' ? res.error : "Failed to update");
            else setEditing(null);
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this teacher? This will also remove their login account.")) return;
        startTransition(async () => { await deleteTeacher(id); });
    };

    const handleToggleStatus = (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            await toggleTeacherStatus(id, !currentStatus);
        });
    };

    const handleResetPassword = (userId: string) => {
        if (!confirm("Reset this user's password? This will generate a NEW temporary password and force them to change it on next login.")) return;
        startTransition(async () => {
            const res = await resetUserPassword(userId, "/admin/teachers");
            if (res.error) setError(res.error);
            else if (res.tempPassword) {
                const teacher = teachers.find(t => t.userId === userId);
                setNewAccountInfo({ email: teacher?.email || "User", tempPass: res.tempPassword });
            }
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Teachers</h2>
                    <p className="text-slate-500 text-sm mt-1">{teachers.length} teacher{teachers.length !== 1 ? "s" : ""} registered</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); setError(""); setNewAccountInfo(null); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-200">
                    <Plus className="h-4 w-4" /> Add Teacher
                </button>
            </div>

            {/* Success Info (Temp Password) */}
            {newAccountInfo && (
                <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] p-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-emerald-500 text-white p-2 rounded-xl">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-emerald-900">Account Created Successfully!</h3>
                        </div>
                        <button onClick={() => setNewAccountInfo(null)} className="text-emerald-500 hover:text-emerald-700">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Teacher Email</p>
                            <p className="font-bold text-slate-700">{newAccountInfo.email}</p>
                        </div>
                        <div className="h-px md:h-8 md:w-px bg-slate-100" />
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Temporary Password</p>
                            <p className="font-mono font-bold text-emerald-600 text-lg tracking-wider">{newAccountInfo.tempPass}</p>
                        </div>
                        <button 
                            onClick={() => copyToClipboard(`Email: ${newAccountInfo.email}\nPassword: ${newAccountInfo.tempPass}`)}
                            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all active:scale-95"
                        >
                            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'Copied!' : 'Copy Login Details'}
                        </button>
                    </div>
                    <p className="mt-4 text-xs text-emerald-600 font-medium">Please share these details with the teacher. They will be forced to change this password on their first login.</p>
                </div>
            )}

            {/* Add Form */}
            {showForm && !newAccountInfo && (
                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-900">Create Teacher Account</h3>
                        <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <X className="h-5 w-5 text-slate-400" />
                        </button>
                    </div>
                    <form onSubmit={handleCreate} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm font-bold flex items-center space-x-2">
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Full Name</label>
                                <input name="fullName" placeholder="Jane Doe" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Email Address</label>
                                <input name="email" type="email" placeholder="jane.doe@florapublic.edu" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Primary Subject</label>
                                <input name="subject" placeholder="Mathematics" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Phone Number</label>
                                <input name="phone" placeholder="+1 234 567 890" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium" />
                            </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-xs text-blue-700 font-medium">
                            The system will automatically generate a secure temporary password for this teacher.
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={isPending}
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-60">
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                Create Teacher Account
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Form */}
            {editing && (
                <div className="bg-white border border-blue-200 rounded-[2rem] shadow-xl shadow-blue-100/50 p-8 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-900">Edit Profile</h3>
                        <button onClick={() => setEditing(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <X className="h-5 w-5 text-slate-400" />
                        </button>
                    </div>
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input type="hidden" name="id" value={editing.id} />
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Full Name</label>
                            <input name="fullName" defaultValue={editing.fullName} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Subject</label>
                            <input name="subject" defaultValue={editing.subject} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Phone Number</label>
                            <input name="phone" defaultValue={editing.phone ?? ""} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                        </div>
                        <div className="md:col-span-2 flex justify-end pt-2">
                            <button type="submit" disabled={isPending}
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-60">
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            {teachers.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-slate-100 px-6 py-20 text-center shadow-sm">
                    <BookOpen className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-lg">No teachers yet</p>
                    <p className="text-slate-400 text-sm mt-1">Ready to build your team? Add your first teacher!</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    {["Teacher", "Subject", "Status", "Joined", "Actions"].map(h => (
                                        <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {teachers.map((t) => (
                                    <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{t.fullName}</span>
                                                <span className="text-xs text-slate-400 font-medium">{t.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 uppercase tracking-tighter">
                                                {t.subject}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleToggleStatus(t.id, t.isActive ?? true)}
                                                disabled={isPending}
                                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                                                    t.isActive !== false 
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100' 
                                                        : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                                                }`}
                                            >
                                                {t.isActive !== false ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                                                {t.isActive !== false ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 font-medium text-xs">
                                            {new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleResetPassword(t.userId)} disabled={isPending}
                                                    title="Reset Password"
                                                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all">
                                                    <KeyRound className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => { setEditing(t); setShowForm(false); setError(""); setNewAccountInfo(null); }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(t.id)} disabled={isPending}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
