import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import DownloadManager from '@/components/admin/DownloadManager';

export const metadata: Metadata = {
  title: 'Manage Downloads | Admin Portal',
};

export default async function DownloadsPage() {
  const downloads = await prisma.downloadFile.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <DownloadManager initialData={downloads} />
    </div>
  );
}
