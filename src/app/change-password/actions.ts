'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function updatePassword(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const validatedFields = ChangePasswordSchema.safeParse({
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat()[0];
      return { error: firstError || "Invalid input" };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return { error: "User not found" };

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { error: "The current temporary password you entered is incorrect" };
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 12);

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        mustChangePassword: false,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Password Update Error:', error);
    return { error: "An unexpected error occurred while updating your password" };
  }
}
