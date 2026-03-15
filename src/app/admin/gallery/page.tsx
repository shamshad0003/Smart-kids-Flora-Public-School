import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import GalleryManager from '@/components/admin/GalleryManager';

export const metadata: Metadata = {
  title: 'Manage Gallery | Admin Portal',
};

export default async function GalleryPage() {
  const images = await prisma.galleryItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <GalleryManager initialData={images} />
    </div>
  );
}
