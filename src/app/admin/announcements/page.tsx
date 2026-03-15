import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AnnouncementManager from '@/components/admin/AnnouncementManager';

export const metadata: Metadata = {
  title: 'Manage Announcements | Admin Portal',
};

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <AnnouncementManager initialData={announcements} />
    </div>
  );
}
