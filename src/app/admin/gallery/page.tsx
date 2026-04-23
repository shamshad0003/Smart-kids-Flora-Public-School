import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import GalleryManager from '@/components/admin/GalleryManager';
import { GalleryItem } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Manage Gallery | Admin Portal',
};

export default async function GalleryPage() {
  let images: GalleryItem[] = [];
  let connectionError = false;

  try {
    images = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Database connection error in GalleryPage:', error);
    connectionError = true;
  }

  if (connectionError) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-8 rounded-3xl shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Database Connection Error</h1>
          <p className="mb-6 leading-relaxed">
            The website is unable to connect to your database. This is usually caused by an incorrect 
            <strong> DATABASE_URL</strong> in your Vercel settings.
          </p>
          <div className="bg-white/50 p-6 rounded-2xl border border-rose-100 mb-6">
            <h2 className="font-semibold mb-2">Checklist for Vercel Settings:</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Is <strong>DATABASE_URL</strong> added to Vercel?</li>
              <li>Is <strong>DIRECT_URL</strong> added to Vercel?</li>
              <li>If your password has an <strong>@</strong>, change it to <strong>%40</strong>.</li>
            </ul>
          </div>
          <p className="text-sm opacity-60">
            Please fix the settings in Vercel and <strong>Redeploy</strong> your project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <GalleryManager initialData={images} />
    </div>
  );
}
