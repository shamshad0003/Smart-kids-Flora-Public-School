import { auth } from "./auth";

interface AuthUser {
    id: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
}

export async function getSession() {
    return await auth();
}

export async function getCurrentUser() {
    const session = await getSession();
    return session?.user;
}

export async function isAdmin() {
    const user = await getCurrentUser() as AuthUser | undefined;
    return user?.role === "ADMIN";
}

export async function isTeacher() {
    const user = await getCurrentUser() as AuthUser | undefined;
    return user?.role === "TEACHER";
}

export async function isStudent() {
    const user = await getCurrentUser() as AuthUser | undefined;
    return user?.role === "STUDENT";
}

export async function isParent() {
    const user = await getCurrentUser() as AuthUser | undefined;
    return user?.role === "PARENT";
}

/**
 * Throws an error if the user is not an admin.
 * Useful for protecting server actions.
 */
export async function requireAdmin() {
    const admin = await isAdmin();
    if (!admin) {
        throw new Error("Unauthorized: Admin access required.");
    }
}

/**
 * Throws an error if the user is not a teacher.
 */
export async function requireTeacher() {
    const teacher = await isTeacher();
    if (!teacher) {
        throw new Error("Unauthorized: Teacher access required.");
    }
}
