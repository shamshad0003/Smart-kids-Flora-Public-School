"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { z } from "zod";
import { generateTempPassword } from "@/lib/user-utils";

const ParentSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().optional(),
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
            password: formData.get("password") || undefined,
        });

        if (!validatedFields.success) {
            return { error: validatedFields.error.flatten().fieldErrors };
        }

        const { fullName, email, phone, password: customPassword } = validatedFields.data;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return { error: { email: ["Email already in use."] } };

        const tempPassword = customPassword || generateTempPassword();
        const hashed = await bcrypt.hash(tempPassword, 12);

        const user = await prisma.user.create({
            data: { 
                name: fullName, 
                email, 
                password: hashed, 
                role: "PARENT",
                mustChangePassword: true,
                isActive: true
            },
        });

        await prisma.parent.create({
            data: { userId: user.id, fullName, email, phone: phone || null },
        });

        revalidatePath("/admin/parents");
        return { success: true, tempPassword: !customPassword ? tempPassword : null };
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return { error: message };
    }
}

// ─── Toggle Parent Status ────────────────────────────────────
export async function toggleParentStatus(id: string, active: boolean) {
    try {
        await requireAdmin();
        const parent = await prisma.parent.findUnique({ where: { id } });
        if (!parent) return { error: "Parent not found" };

        await prisma.user.update({
            where: { id: parent.userId },
            data: { isActive: active }
        });

        revalidatePath("/admin/parents");
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update status";
        return { error: message };
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
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return { error: message };
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
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return { error: message };
    }
}
