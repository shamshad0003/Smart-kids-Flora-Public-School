"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAdmissionStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED") {
    await prisma.admission.update({ where: { id }, data: { status } });
    revalidatePath("/admin/admissions");
    return { success: true };
}

export async function updateAdmissionNotes(id: string, notes: string) {
    await prisma.admission.update({ where: { id }, data: { notes } });
    revalidatePath("/admin/admissions");
    return { success: true };
}
