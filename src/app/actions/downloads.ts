'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function createDownload(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const documentFile = formData.get('documentFile') as File;

    if (!title || !category || !documentFile) {
      return { error: 'Missing required fields' };
    }

    // Save file to public/uploads
    const bytes = await documentFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const extension = path.extname(documentFile.name) || '.pdf';
    const filename = `${uuidv4()}${extension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, buffer);
    const fileUrl = `/uploads/${filename}`;

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
