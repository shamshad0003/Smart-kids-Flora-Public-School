"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";

export async function updateAdmissionStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED") {
    try {
        await requireAdmin();
        await prisma.admission.update({ where: { id }, data: { status } });
        revalidatePath("/admin/admissions");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "An unexpected error occurred" };
    }
}

export async function updateAdmissionNotes(id: string, notes: string) {
    try {
        await requireAdmin();
        await prisma.admission.update({ where: { id }, data: { notes } });
        revalidatePath("/admin/admissions");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "An unexpected error occurred" };
    }
}
