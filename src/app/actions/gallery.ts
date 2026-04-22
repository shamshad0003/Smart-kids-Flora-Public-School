'use server';

import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createGalleryItem(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('imageFile') as File;

    if (!imageFile || imageFile.size === 0) {
      return { error: 'No image file provided' };
    }

// 1. Upload to Supabase Storage
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Simpler naming to avoid 'path' and 'uuid' dependencies
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExt = imageFile.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${randomStr}.${fileExt}`;
    const storagePath = `${category.toLowerCase()}/${fileName}`;

    console.log('Attempting Supabase upload to path:', storagePath);
    
    if (!supabase) {
      return { error: 'Cloud storage client not initialized. Check your Supabase keys in Vercel.' };
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(storagePath, buffer, {
        contentType: imageFile.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase storage upload error details:', uploadError);
      return { error: `Storage upload failed: ${uploadError.message}. Check your Supabase bucket policies.` };
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(storagePath);
      
    // 3. Create database entry
    if (!prisma) {
      return { error: 'Database client not initialized. Check your DATABASE_URL in Vercel.' };
    }

    try {
      await prisma.galleryItem.create({
        data: {
          title,
          category,
          imageUrl: publicUrl,
        },
      });
    } catch (dbError: any) {
      console.error('Database save error:', dbError);
      return { error: `Image uploaded but database failed: ${dbError.message || 'Check DATABASE_URL'}` };
    }

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');

    return { success: true };
  } catch (fatalError: any) {
    console.error('FATAL ERROR in createGalleryItem:', fatalError);
    return { error: `A critical error occurred: ${fatalError.message || 'Unknown error'}. This usually means a connection issue.` };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    const item = await prisma.galleryItem.findUnique({ where: { id } });
    if (item) {
      // Extract filename and category from Supabase URL
      // URL format: .../storage/v1/object/public/gallery/category/filename.jpg
      const urlParts = item.imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      const category = urlParts[urlParts.length - 2];
      
      await supabase.storage
        .from('gallery')
        .remove([`${category}/${filename}`]);
    }

    await prisma.galleryItem.delete({
      where: { id },
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete gallery image:', error);
    return { error: 'Failed to delete gallery image' };
  }
}
