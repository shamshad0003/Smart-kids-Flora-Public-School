"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { z } from "zod";

const NotificationSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    message: z.string().min(5, "Message must be at least 5 characters"),
    targetRole: z.enum(["ADMIN", "TEACHER", "STUDENT", "PARENT", "ALL"]),
});

export async function createNotification(formData: FormData) {
    try {
        await requireAdmin();

        const validatedFields = NotificationSchema.safeParse({
            title: formData.get("title"),
            message: formData.get("message"),
            targetRole: formData.get("targetRole"),
        });

        if (!validatedFields.success) {
            return { error: validatedFields.error.flatten().fieldErrors };
        }

        await prisma.notification.create({ data: validatedFields.data });
        revalidatePath("/admin/notifications");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "An unexpected error occurred" };
    }
}

export async function deleteNotification(id: string) {
    try {
        await requireAdmin();
        await prisma.notification.delete({ where: { id } });
        revalidatePath("/admin/notifications");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "An unexpected error occurred" };
    }
}
