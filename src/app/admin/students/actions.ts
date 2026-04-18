"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { z } from "zod";
import { generateTempPassword } from "@/lib/user-utils";

const StudentSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    gradeLevel: z.string().min(1, "Grade level is required"),
    password: z.string().optional(),
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
            password: formData.get("password") || undefined,
            parentId: formData.get("parentId"),
        });

        if (!validatedFields.success) {
            return { error: validatedFields.error.flatten().fieldErrors };
        }

        const { fullName, email, phone, gradeLevel, password: customPassword, parentId } = validatedFields.data;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return { error: { email: ["Email already in use."] } };

        const tempPassword = customPassword || generateTempPassword();
        const hashed = await bcrypt.hash(tempPassword, 12);

        const user = await prisma.user.create({
            data: { 
                name: fullName, 
                email, 
                password: hashed, 
                role: "STUDENT",
                mustChangePassword: true,
                isActive: true
            },
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
        return { success: true, tempPassword: !customPassword ? tempPassword : null };
    } catch (error: any) {
        return { error: error.message || "An unexpected error occurred" };
    }
}

// ─── Toggle Student Status ────────────────────────────────────
export async function toggleStudentStatus(id: string, active: boolean) {
    try {
        await requireAdmin();
        const student = await prisma.student.findUnique({ where: { id } });
        if (!student) return { error: "Student not found" };

        await prisma.user.update({
            where: { id: student.userId },
            data: { isActive: active }
        });

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to update status" };
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
