import { prisma } from "@/lib/prisma";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function Announcements() {
    // Fetch latest 3 published announcements
    const announcements = await prisma.announcement.findMany({
        where: {
            published: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 3,
    });

    return <AnnouncementsClient announcements={announcements} />;
}
