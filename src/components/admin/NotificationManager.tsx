"use client";
import { useState, useTransition } from "react";
import { createNotification, deleteNotification } from "@/app/admin/notifications/actions";
import { Plus, Trash2, Loader2, Bell, BellOff } from "lucide-react";

type Notification = { id: string; title: string; message: string; targetRole: string; createdAt: Date };
const ROLES = ["ALL", "ADMIN", "TEACHER", "STUDENT", "PARENT"] as const;
const roleColors: Record<string, string> = {
    ALL: "bg-slate-100 text-slate-700",
    ADMIN: "bg-red-50 text-red-700",
    TEACHER: "bg-emerald-50 text-emerald-700",
    STUDENT: "bg-blue-50 text-blue-700",
    PARENT: "bg-violet-50 text-violet-700",
};

export default function NotificationManager({ notifications }: { notifications: Notification[] }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); setError(""); setSuccess("");
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await createNotification(fd) as { error?: string, success?: boolean };
            if (res?.error) setError(res.error);
            else { setSuccess("Notification sent!"); (e.target as HTMLFormElement).reset(); }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this notification?")) return;
        startTransition(async () => { await deleteNotification(id); });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Notifications</h2>
                <p className="text-slate-500 text-sm mt-1">Create and broadcast school-wide notifications by role</p>
            </div>

            {/* Create Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-4">New Notification</h3>
                <form onSubmit={handleCreate} className="space-y-4">
                    {error && <div className="bg-red-50 text-red-700 rounded-xl px-4 py-2.5 text-sm">{error}</div>}
                    {success && <div className="bg-green-50 text-green-700 rounded-xl px-4 py-2.5 text-sm">{success}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input name="title" placeholder="Title *" required className="input-field md:col-span-2" />
                        <select name="targetRole" required className="input-field text-slate-600">
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <textarea name="message" placeholder="Message *" required rows={3} className="input-field w-full resize-none" />
                    <button type="submit" disabled={isPending}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60">
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        Send Notification
                    </button>
                </form>
            </div>

            {/* Notification List */}
            {notifications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 px-6 py-16 text-center">
                    <BellOff className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No notifications yet</p>
                    <p className="text-slate-400 text-sm mt-1">Create your first notification above</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <div key={n.id} className="bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-start gap-4">
                            <div className="p-2 bg-blue-50 rounded-xl shrink-0 mt-0.5">
                                <Bell className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold text-slate-900 text-sm">{n.title}</p>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${roleColors[n.targetRole]}`}>{n.targetRole}</span>
                                </div>
                                <p className="text-slate-500 text-sm mt-1">{n.message}</p>
                                <p className="text-slate-400 text-xs mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                            <button onClick={() => handleDelete(n.id)} disabled={isPending}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
