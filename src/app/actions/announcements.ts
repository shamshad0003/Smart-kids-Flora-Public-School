'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createAnnouncement(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'true';

    if (!title || !category || !content) {
      return { error: 'Missing required fields' };
    }

    await prisma.announcement.create({
      data: {
        title,
        category,
        content,
        published,
      },
    });

    revalidatePath('/admin/announcements');
    revalidatePath('/');
    revalidatePath('/announcements');
    return { success: true };
  } catch (error) {
    console.error('Failed to create announcement:', error);
    return { error: 'Failed to create announcement' };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await prisma.announcement.delete({
      where: { id },
    });

    revalidatePath('/admin/announcements');
    revalidatePath('/');
    revalidatePath('/announcements');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete announcement:', error);
    return { error: 'Failed to delete announcement' };
  }
}
