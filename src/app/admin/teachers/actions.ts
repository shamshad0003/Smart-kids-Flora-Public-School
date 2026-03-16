"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// ─── Create Teacher ────────────────────────────────────────────
export async function createTeacher(formData: FormData) {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const subject = formData.get("subject") as string;
    const password = formData.get("password") as string;

    if (!fullName || !email || !subject || !password) {
        return { error: "All required fields must be filled." };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Email already in use." };

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: { name: fullName, email, password: hashed, role: "TEACHER" },
    });

    await prisma.teacher.create({
        data: { userId: user.id, fullName, email, phone: phone || null, subject },
    });

    revalidatePath("/admin/teachers");
    return { success: true };
}

// ─── Update Teacher ────────────────────────────────────────────
export async function updateTeacher(formData: FormData) {
    const id = formData.get("id") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const subject = formData.get("subject") as string;

    await prisma.teacher.update({
        where: { id },
        data: { fullName, phone: phone || null, subject },
    });
    await prisma.user.update({
        where: { id: (await prisma.teacher.findUnique({ where: { id } }))!.userId },
        data: { name: fullName },
    });

    revalidatePath("/admin/teachers");
    return { success: true };
}

// ─── Delete Teacher ────────────────────────────────────────────
export async function deleteTeacher(id: string) {
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) return { error: "Not found." };
    // Cascade deletes teacher + user
    await prisma.user.delete({ where: { id: teacher.userId } });
    revalidatePath("/admin/teachers");
    return { success: true };
}
