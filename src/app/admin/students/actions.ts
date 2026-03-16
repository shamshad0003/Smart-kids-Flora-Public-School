"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// ─── Create Student ────────────────────────────────────────────
export async function createStudent(formData: FormData) {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const gradeLevel = formData.get("gradeLevel") as string;
    const password = formData.get("password") as string;
    const parentId = formData.get("parentId") as string;

    if (!fullName || !email || !gradeLevel || !password) {
        return { error: "All required fields must be filled." };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Email already in use." };

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { name: fullName, email, password: hashed, role: "STUDENT" },
    });

    await prisma.student.create({
        data: {
            userId: user.id,
            fullName,
            email,
            phone: phone || null,
            gradeLevel,
            parentId: parentId || null,
        },
    });

    revalidatePath("/admin/students");
    return { success: true };
}

// ─── Update Student ────────────────────────────────────────────
export async function updateStudent(formData: FormData) {
    const id = formData.get("id") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const gradeLevel = formData.get("gradeLevel") as string;
    const parentId = formData.get("parentId") as string;

    const student = await prisma.student.update({
        where: { id },
        data: { fullName, phone: phone || null, gradeLevel, parentId: parentId || null },
    });
    await prisma.user.update({
        where: { id: student.userId },
        data: { name: fullName },
    });

    revalidatePath("/admin/students");
    return { success: true };
}

// ─── Delete Student ────────────────────────────────────────────
export async function deleteStudent(id: string) {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return { error: "Not found." };
    await prisma.user.delete({ where: { id: student.userId } });
    revalidatePath("/admin/students");
    return { success: true };
}
