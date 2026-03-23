'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function createGalleryItem(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('imageFile') as File;

    console.log('Gallery Upload Attempt:', { title, category, fileName: imageFile?.name, fileSize: imageFile?.size });

    if (!title || !category || !imageFile || imageFile.size === 0) {
      return { error: 'Missing required fields: please ensure title and image are provided' };
    }

    // Save file to public/uploads
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const extension = path.extname(imageFile.name) || '.jpg';
    const filename = `${uuidv4()}${extension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, buffer);
    const imageUrl = `/uploads/${filename}`;

    await prisma.galleryItem.create({
      data: {
        title,
        category,
        imageUrl,
      },
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error('Failed to add gallery image:', error);
    return { error: 'Failed to add image to gallery' };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    // Optionally delete the physical file here if needed
    await prisma.galleryItem.delete({
      where: { id },
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete gallery image:', error);
    return { error: 'Failed to delete gallery image' };
  }
}
