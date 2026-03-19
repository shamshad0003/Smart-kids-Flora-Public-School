"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { z } from "zod";

const ParentSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const ParentUpdateSchema = z.object({
    id: z.string(),
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    phone: z.string().optional(),
});

// ─── Create Parent ────────────────────────────────────────────
export async function createParent(formData: FormData) {
    try {
        await requireAdmin();

        const validatedFields = ParentSchema.safeParse({
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            password: formData.get("password"),
        });

        if (!validatedFields.success) {
            return { error: validatedFields.error.flatten().fieldErrors };
        }

        const { fullName, email, phone, password } = validatedFields.data;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return { error: { email: ["Email already in use."] } };

        const hashed = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { name: fullName, email, password: hashed, role: "PARENT" },
        });

        await prisma.parent.create({
            data: { userId: user.id, fullName, email, phone: phone || null },
        });

        revalidatePath("/admin/parents");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "An unexpected error occurred" };
    }
}

// ─── Update Parent ────────────────────────────────────────────
export async function updateParent(formData: FormData) {
    try {
        await requireAdmin();

        const validatedFields = ParentUpdateSchema.safeParse({
            id: formData.get("id"),
            fullName: formData.get("fullName"),
            phone: formData.get("phone"),
        });

        if (!validatedFields.success) {
            return { error: validatedFields.error.flatten().fieldErrors };
        }

        const { id, fullName, phone } = validatedFields.data;

        const parent = await prisma.parent.update({
            where: { id },
            data: { fullName, phone: phone || null },
        });
        await prisma.user.update({
            where: { id: parent.userId },
            data: { name: fullName },
        });

        revalidatePath("/admin/parents");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "An unexpected error occurred" };
    }
}

// ─── Delete Parent ────────────────────────────────────────────
export async function deleteParent(id: string) {
    try {
        await requireAdmin();
        const parent = await prisma.parent.findUnique({ where: { id } });
        if (!parent) return { error: "Not found." };
        await prisma.user.delete({ where: { id: parent.userId } });
        revalidatePath("/admin/parents");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "An unexpected error occurred" };
    }
}
