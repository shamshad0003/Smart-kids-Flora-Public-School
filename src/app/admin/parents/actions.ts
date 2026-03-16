"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// ─── Create Parent ────────────────────────────────────────────
export async function createParent(formData: FormData) {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    if (!fullName || !email || !password) {
        return { error: "All required fields must be filled." };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Email already in use." };

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { name: fullName, email, password: hashed, role: "PARENT" },
    });

    await prisma.parent.create({
        data: { userId: user.id, fullName, email, phone: phone || null },
    });

    revalidatePath("/admin/parents");
    return { success: true };
}

// ─── Update Parent ────────────────────────────────────────────
export async function updateParent(formData: FormData) {
    const id = formData.get("id") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

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
}

// ─── Delete Parent ────────────────────────────────────────────
export async function deleteParent(id: string) {
    const parent = await prisma.parent.findUnique({ where: { id } });
    if (!parent) return { error: "Not found." };
    await prisma.user.delete({ where: { id: parent.userId } });
    revalidatePath("/admin/parents");
    return { success: true };
}
