import PageHeader from "@/components/layout/PageHeader";
import { prisma } from "@/lib/prisma";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
    // Fetch all gallery items
    const items = await prisma.galleryItem.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    // Extract unique categories and sort them
    const uniqueCategories = Array.from(new Set(items.map(item => item.category))).sort();
    const categories = ["All", ...uniqueCategories];

    return (
        <div>
            <PageHeader
                title="Photo Gallery"
                subtitle="A visual glimpse into the vibrant life and activities at Smart Kids Flora Public School."
            />
            <GalleryClient initialItems={items} categories={categories} />
        </div>
    );
}
