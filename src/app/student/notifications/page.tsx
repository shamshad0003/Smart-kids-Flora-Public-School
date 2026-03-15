import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Bell } from "lucide-react";

export default async function StudentNotificationsPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const notifications = await prisma.notification.findMany({
        where: { targetRole: { in: ["STUDENT", "ALL"] } },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
                <p className="text-slate-500 text-sm mt-1">Stay up to date with school announcements.</p>
            </div>

            {notifications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 py-20 text-center">
                    <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No notifications yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map(n => (
                        <div key={n.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start space-x-4 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center shrink-0">
                                <Bell className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900">{n.title}</p>
                                <p className="text-slate-600 text-sm mt-1">{n.message}</p>
                                <p className="text-xs text-slate-400 mt-2">{new Date(n.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
