"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { generateTempPassword } from "@/lib/user-utils";

/**
 * Resets a user's password to a newly generated temporary one.
 * Forces the user to change the password on their next login.
 */
export async function resetUserPassword(userId: string, revalidateUrl?: string) {
    try {
        await requireAdmin();

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { error: "User not found" };

        const tempPassword = generateTempPassword();
        const hashed = await bcrypt.hash(tempPassword, 12);

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashed,
                mustChangePassword: true,
                isActive: true // Ensure it's active so they can log in to change it
            },
        });

        if (revalidateUrl) {
            revalidatePath(revalidateUrl);
        }

        return { success: true, tempPassword };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return { error: message };
    }
}
