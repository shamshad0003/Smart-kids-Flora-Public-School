"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { z } from "zod";

const StudentSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    gradeLevel: z.string().min(1, "Grade level is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    parentId: z.string().optional(),
});

const StudentUpdateSchema = z.object({
    id: z.string(),
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    phone: z.string().optional(),
    gradeLevel: z.string().min(1, "Grade level is required"),
    parentId: z.string().optional(),
});

// ─── Create Student ────────────────────────────────────────────
export async function createStudent(formData: FormData) {
    try {
        await requireAdmin();

        const validatedFields = StudentSchema.safeParse({
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            gradeLevel: formData.get("gradeLevel"),
            password: formData.get("password"),
            parentId: formData.get("parentId"),
        });

        if (!validatedFields.success) {
            return { error: validatedFields.error.flatten().fieldErrors };
        }

        const { fullName, email, phone, gradeLevel, password, parentId } = validatedFields.data;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return { error: { email: ["Email already in use."] } };

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
    } catch (error: any) {
        return { error: error.message || "An unexpected error occurred" };
    }
}

// ─── Update Student ────────────────────────────────────────────
export async function updateStudent(formData: FormData) {
    try {
        await requireAdmin();

        const validatedFields = StudentUpdateSchema.safeParse({
            id: formData.get("id"),
            fullName: formData.get("fullName"),
            phone: formData.get("phone"),
            gradeLevel: formData.get("gradeLevel"),
            parentId: formData.get("parentId"),
        });

        if (!validatedFields.success) {
            return { error: validatedFields.error.flatten().fieldErrors };
        }

        const { id, fullName, phone, gradeLevel, parentId } = validatedFields.data;

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
    } catch (error: any) {
        return { error: error.message || "An unexpected error occurred" };
    }
}

// ─── Delete Student ────────────────────────────────────────────
export async function deleteStudent(id: string) {
    try {
        await requireAdmin();
        const student = await prisma.student.findUnique({ where: { id } });
        if (!student) return { error: "Not found." };
        await prisma.user.delete({ where: { id: student.userId } });
        revalidatePath("/admin/students");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "An unexpected error occurred" };
    }
}
