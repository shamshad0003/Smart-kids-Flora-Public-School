'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createGalleryItem(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!title || !category || !imageUrl) {
      return { error: 'Missing required fields' };
    }

    await prisma.galleryItem.create({
      data: {
        title,
        category,
        imageUrl,
      },
    });

    revalidatePath('/admin/gallery');
    return { success: true };
  } catch (error) {
    console.error('Failed to add gallery image:', error);
    return { error: 'Failed to add image to gallery' };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    await prisma.galleryItem.delete({
      where: { id },
    });

    revalidatePath('/admin/gallery');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete gallery image:', error);
    return { error: 'Failed to delete gallery image' };
  }
}
