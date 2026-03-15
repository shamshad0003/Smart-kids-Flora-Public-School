import { prisma } from "@/lib/prisma";
import GalleryPreviewClient from "./GalleryPreviewClient";

export default async function GalleryPreview() {
    // Fetch latest 3 gallery items
    const galleryItems = await prisma.galleryItem.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: 3,
    });

    return <GalleryPreviewClient items={galleryItems} />;
}
