'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createEvent(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const eventDateStr = formData.get('eventDate') as string;

    if (!title || !description || !location || !eventDateStr) {
      return { error: 'Missing required fields' };
    }

    const eventDate = new Date(eventDateStr);

    await prisma.event.create({
      data: {
        title,
        description,
        location,
        eventDate,
      },
    });

    revalidatePath('/admin/events');
    return { success: true };
  } catch (error) {
    console.error('Failed to create event:', error);
    return { error: 'Failed to create event' };
  }
}

export async function deleteEvent(id: string) {
  try {
    await prisma.event.delete({
      where: { id },
    });

    revalidatePath('/admin/events');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete event:', error);
    return { error: 'Failed to delete event' };
  }
}
