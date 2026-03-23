'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createDownload(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const fileUrl = formData.get('fileUrl') as string;

    if (!title || !category || !fileUrl) {
      return { error: 'Missing required fields' };
    }

    await prisma.downloadFile.create({
      data: {
        title,
        category,
        fileUrl,
      },
    });

    revalidatePath('/admin/downloads');
    revalidatePath('/');
    revalidatePath('/downloads');
    return { success: true };
  } catch (error) {
    console.error('Failed to create download:', error);
    return { error: 'Failed to create download document' };
  }
}

export async function deleteDownload(id: string) {
  try {
    await prisma.downloadFile.delete({
      where: { id },
    });

    revalidatePath('/admin/downloads');
    revalidatePath('/');
    revalidatePath('/downloads');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete download:', error);
    return { error: 'Failed to delete download document' };
  }
}
