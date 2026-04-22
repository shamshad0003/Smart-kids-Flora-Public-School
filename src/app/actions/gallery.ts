'use server';

import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
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

    // 1. Upload to Supabase Storage
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = path.extname(imageFile.name) || '.jpg';
    const filename = `${uuidv4()}${extension}`;
    const storagePath = `gallery/${filename}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(storagePath, buffer, {
        contentType: imageFile.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return { error: `Storage upload failed: ${uploadError.message}. Make sure the 'gallery' bucket exists in Supabase.` };
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(storagePath);

    // 3. Create database entry
    await prisma.galleryItem.create({
      data: {
        title,
        category,
        imageUrl: publicUrl,
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
    const item = await prisma.galleryItem.findUnique({ where: { id } });
    if (item) {
      // Extract filename from Supabase URL (e.g., .../gallery/filename.jpg)
      const urlParts = item.imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      
      await supabase.storage
        .from('gallery')
        .remove([`gallery/${filename}`]);
    }

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
