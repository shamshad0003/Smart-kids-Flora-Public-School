"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
    const schoolName = formData.get("schoolName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    // Upsert the single settings record
    const existing = await prisma.schoolSettings.findFirst();
    if (existing) {
        await prisma.schoolSettings.update({
            where: { id: existing.id },
            data: { schoolName, email, phone, address },
        });
    } else {
        await prisma.schoolSettings.create({
            data: { schoolName, email, phone, address },
        });
    }

    revalidatePath("/admin/settings");
    return { success: true };
}
