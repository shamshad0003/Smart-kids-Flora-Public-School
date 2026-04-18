"use client";
import { useState, useTransition } from "react";
import { createStudent, updateStudent, deleteStudent, toggleStudentStatus } from "@/app/admin/students/actions";
import { Plus, Pencil, Trash2, Loader2, X, GraduationCap, ShieldCheck, UserCheck, UserX, Copy, CheckCircle2, Link as LinkIcon } from "lucide-react";

type Student = {
    id: string; 
    fullName: string; 
    email: string; 
    phone: string | null;
    gradeLevel: string; 
    parentId: string | null; 
    createdAt: Date;
    isActive?: boolean;
};
type Parent = { id: string; fullName: string; };

export default function StudentManager({ students, parents }: { students: Student[]; parents: Parent[] }) {
    const [isPending, startTransition] = useTransition();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Student | null>(null);
    const [error, setError] = useState("");
    const [newAccountInfo, setNewAccountInfo] = useState<{email: string, tempPass: string} | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); setError("");
        const fd = new FormData(e.currentTarget);
        const email = fd.get("email") as string;
        
        startTransition(async () => {
            const res = await createStudent(fd) as { error?: string, success?: boolean, tempPassword?: string };
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
        e.preventDefault(); setError("");
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await updateStudent(fd) as { error?: string, success?: boolean };
            if (res?.error) setError(typeof res.error === 'string' ? res.error : "Failed to update");
            else setEditing(null);
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this student? This will also remove their login account and all academic records.")) return;
        startTransition(async () => { await deleteStudent(id); });
    };

    const handleToggleStatus = (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            await toggleStudentStatus(id, !currentStatus);
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Students</h2>
                    <p className="text-slate-500 text-sm mt-1">{students.length} student{students.length !== 1 ? "s" : ""} enrolled</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); setError(""); setNewAccountInfo(null); }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-200">
                    <Plus className="h-4 w-4" /> Add Student
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
                            <h3 className="font-bold text-emerald-900">Student Account Created!</h3>
                        </div>
                        <button onClick={() => setNewAccountInfo(null)} className="text-emerald-500 hover:text-emerald-700">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Student Email</p>
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
                </div>
            )}

            {showForm && !newAccountInfo && (
                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-900">Enroll New Student</h3>
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
                                <input name="fullName" placeholder="John Smith" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Student Email</label>
                                <input name="email" type="email" placeholder="john.smith@florapublic.edu" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Grade Level</label>
                                <input name="gradeLevel" placeholder="Standard 10-A" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Link Parent Account</label>
                                <select name="parentId" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-600 italic">
                                    <option value="">No Parent Linked</option>
                                    {parents.map(p => <option key={p.id} value={p.id} className="not-italic font-medium">{p.fullName}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Contact Phone (Optional)</label>
                                <input name="phone" placeholder="+1 234 567 890" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium" />
                            </div>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-xs text-indigo-700 font-medium">
                            The student will be assigned a temporary password automatically. Parental linking can be updated anytime in the student profile.
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={isPending}
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-60">
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                Enroll Student
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {editing && (
                <div className="bg-white border border-indigo-200 rounded-[2rem] shadow-xl shadow-indigo-100/50 p-8 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-900">Edit Student Enrollment</h3>
                        <button onClick={() => setEditing(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <X className="h-5 w-5 text-slate-400" />
                        </button>
                    </div>
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input type="hidden" name="id" value={editing.id} />
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Full Name</label>
                            <input name="fullName" defaultValue={editing.fullName} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Grade Level</label>
                            <input name="gradeLevel" defaultValue={editing.gradeLevel} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Link Parent</label>
                            <select name="parentId" defaultValue={editing.parentId ?? ""} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium">
                                <option value="">No Parent Linked</option>
                                {parents.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Phone</label>
                            <input name="phone" defaultValue={editing.phone ?? ""} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" />
                        </div>
                        <div className="md:col-span-2 flex justify-end pt-2">
                            <button type="submit" disabled={isPending}
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-60">
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {students.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-slate-100 px-6 py-20 text-center shadow-sm">
                    <GraduationCap className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-lg">No students yet</p>
                    <p className="text-slate-400 text-sm mt-1">Start enrolling students to manage their academic journey.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    {["Student", "Grade", "Status", "Parent Info", "Actions"].map(h => (
                                        <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {students.map((s) => {
                                    const parent = parents.find(p => p.id === s.parentId);
                                    return (
                                        <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{s.fullName}</span>
                                                    <span className="text-xs text-slate-400 font-medium">{s.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 font-bold">{s.gradeLevel}</td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    onClick={() => handleToggleStatus(s.id, s.isActive ?? true)}
                                                    disabled={isPending}
                                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                                                        s.isActive !== false 
                                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100' 
                                                            : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                                                    }`}
                                                >
                                                    {s.isActive !== false ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                                                    {s.isActive !== false ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                {parent ? (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <LinkIcon className="h-3 w-3 text-indigo-400" />
                                                        <span className="font-medium">{parent.fullName}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300 italic text-xs">Unlinked</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setEditing(s); setShowForm(false); setError(""); setNewAccountInfo(null); }}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(s.id)} disabled={isPending}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
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
                </div>
            )}
        </div>
    );
}
