import { prisma } from "@/lib/prisma";
import NotificationManager from "@/components/admin/NotificationManager";

export default async function NotificationsPage() {
    const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="max-w-4xl mx-auto">
            <NotificationManager notifications={notifications} />
        </div>
    );
}
