"use client";
import { useState, useTransition } from "react";
import { updateSettings } from "@/app/admin/settings/actions";
import { Loader2, Save, CheckCircle } from "lucide-react";

type SchoolSettings = { id: string; schoolName: string; email: string; phone: string; address: string } | null;

export default function SettingsForm({ settings }: { settings: SchoolSettings }) {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); setSuccess(false); setError("");
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await updateSettings(fd);
            if (res?.success) setSuccess(true);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            {success && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
                    <CheckCircle className="h-4 w-4 shrink-0" /> Settings saved successfully!
                </div>
            )}
            {error && <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">School Name</label>
                <input name="schoolName" defaultValue={settings?.schoolName ?? "Smart Kids Flora Public School"} required className="input-field w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Contact Email</label>
                    <input name="email" type="email" defaultValue={settings?.email ?? ""} placeholder="admin@school.edu" className="input-field w-full" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                    <input name="phone" defaultValue={settings?.phone ?? ""} placeholder="+92 300 0000000" className="input-field w-full" />
                </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">School Address</label>
                <textarea name="address" defaultValue={settings?.address ?? ""} rows={3} placeholder="123 School Lane, City, Country" className="input-field w-full resize-none" />
            </div>
            <button type="submit" disabled={isPending}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Settings
            </button>
        </form>
    );
}
