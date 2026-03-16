import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
    const settings = await prisma.schoolSettings.findFirst();

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900">School Settings</h2>
                <p className="text-slate-500 text-sm mt-1">Update your school profile and contact information</p>
            </div>
            <SettingsForm settings={settings} />
        </div>
    );
}
