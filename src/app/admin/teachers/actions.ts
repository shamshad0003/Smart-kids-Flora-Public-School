"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { z } from "zod";
import { generateTempPassword } from "@/lib/user-utils";

const TeacherSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    subject: z.string().min(2, "Subject is required"),
    password: z.string().optional(), // Now optional as we generate one if not provided
});

const TeacherUpdateSchema = z.object({
    id: z.string(),
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    phone: z.string().optional(),
    subject: z.string().min(2, "Subject is required"),
});

// ─── Create Teacher ────────────────────────────────────────────
export async function createTeacher(formData: FormData) {
    try {
        await requireAdmin();

        const validatedFields = TeacherSchema.safeParse({
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            subject: formData.get("subject"),
            password: formData.get("password") || undefined,
        });

        if (!validatedFields.success) {
            return { error: validatedFields.error.flatten().fieldErrors };
        }

        const { fullName, email, phone, subject, password: customPassword } = validatedFields.data;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return { error: { email: ["Email already in use."] } };

        // Handle password generation
        const tempPassword = customPassword || generateTempPassword();
        const hashed = await bcrypt.hash(tempPassword, 12);

        const user = await prisma.user.create({
            data: { 
                name: fullName, 
                email, 
                password: hashed, 
                role: "TEACHER",
                mustChangePassword: true,
                isActive: true
            },
        });

        await prisma.teacher.create({
            data: { userId: user.id, fullName, email, phone: phone || null, subject },
        });

        revalidatePath("/admin/teachers");
        
        // Return the temporary password so it can be shown to the admin ONCE
        return { success: true, tempPassword: !customPassword ? tempPassword : null };
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return { error: message };
    }
}

// ─── Toggle Teacher Status ────────────────────────────────────
export async function toggleTeacherStatus(id: string, active: boolean) {
    try {
        await requireAdmin();
        const teacher = await prisma.teacher.findUnique({ where: { id } });
        if (!teacher) return { error: "Teacher not found" };

        await prisma.user.update({
            where: { id: teacher.userId },
            data: { isActive: active }
        });

        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update status";
        return { error: message };
    }
}

// ─── Update Teacher ────────────────────────────────────────────
export async function updateTeacher(formData: FormData) {
    try {
        await requireAdmin();

        const validatedFields = TeacherUpdateSchema.safeParse({
            id: formData.get("id"),
            fullName: formData.get("fullName"),
            phone: formData.get("phone"),
            subject: formData.get("subject"),
        });

        if (!validatedFields.success) {
            return { error: validatedFields.error.flatten().fieldErrors };
        }

        const { id, fullName, phone, subject } = validatedFields.data;

        const teacher = await prisma.teacher.update({
            where: { id },
            data: { fullName, phone: phone || null, subject },
        });
        await prisma.user.update({
            where: { id: teacher.userId },
            data: { name: fullName },
        });

        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return { error: message };
    }
}

// ─── Delete Teacher ────────────────────────────────────────────
export async function deleteTeacher(id: string) {
    try {
        await requireAdmin();
        const teacher = await prisma.teacher.findUnique({ where: { id } });
        if (!teacher) return { error: "Not found." };
        await prisma.user.delete({ where: { id: teacher.userId } });
        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return { error: message };
    }
}
