'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateAdmissionStatus(id: string, status: string) {
  try {
    await prisma.admission.update({
      where: { id },
      data: { status },
    });

    revalidatePath('/admin/admissions');
    return { success: true };
  } catch (error) {
    console.error('Failed to update admission status:', error);
    return { error: 'Failed to update admission status' };
  }
}

export async function deleteAdmission(id: string) {
  try {
    await prisma.admission.delete({
      where: { id },
    });

    revalidatePath('/admin/admissions');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete admission:', error);
    return { error: 'Failed to delete admission' };
  }
}
