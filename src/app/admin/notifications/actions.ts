"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createNotification(formData: FormData) {
    const title = formData.get("title") as string;
    const message = formData.get("message") as string;
    const targetRole = formData.get("targetRole") as string;

    if (!title || !message || !targetRole) return { error: "All fields are required." };

    await prisma.notification.create({ data: { title, message, targetRole } });
    revalidatePath("/admin/notifications");
    return { success: true };
}

export async function deleteNotification(id: string) {
    await prisma.notification.delete({ where: { id } });
    revalidatePath("/admin/notifications");
    return { success: true };
}
