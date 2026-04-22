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

    if (!imageFile || imageFile.size === 0) {
      return { error: 'No image file provided' };
    }

    // 1. Upload to Supabase Storage
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const fileExt = path.extname(imageFile.name) || '.jpg';
    const fileName = `${uuidv4()}${fileExt}`;
    const storagePath = `${category.toLowerCase()}/${fileName}`;

    console.log('Attempting Supabase upload to path:', storagePath);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(storagePath, buffer, {
        contentType: imageFile.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase storage upload error details:', {
        message: uploadError.message,
        name: uploadError.name,
        status: (uploadError as any).status
      });
      return { error: `Storage upload failed: ${uploadError.message}. Please check your Supabase bucket policies.` };
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(storagePath);
      
    console.log('Generated Public URL:', publicUrl);

    // 3. Create database entry
    try {
      await prisma.galleryItem.create({
        data: {
          title,
          category,
          imageUrl: publicUrl,
        },
      });
    } catch (dbError) {
      console.error('Database save error for gallery item:', dbError);
      return { error: 'Image uploaded to cloud but failed to save in database. Check your DATABASE_URL in Vercel.' };
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
