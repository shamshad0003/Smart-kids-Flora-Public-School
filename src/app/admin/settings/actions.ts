"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { z } from "zod";

const SettingsSchema = z.object({
    schoolName: z.string().min(3, "School name must be at least 3 characters"),
    email: z.string().email("Invalid school email"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(5, "Address must be at least 5 characters"),
});

export async function updateSettings(formData: FormData) {
    try {
        await requireAdmin();

        const validatedFields = SettingsSchema.safeParse({
            schoolName: formData.get("schoolName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            address: formData.get("address"),
        });

        if (!validatedFields.success) {
            return { error: validatedFields.error.flatten().fieldErrors };
        }

        const data = validatedFields.data;

        // Upsert the single settings record
        const existing = await prisma.schoolSettings.findFirst();
        if (existing) {
            await prisma.schoolSettings.update({
                where: { id: existing.id },
                data,
            });
        } else {
            await prisma.schoolSettings.create({
                data,
            });
        }

        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "An unexpected error occurred" };
    }
}
