"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getTeacher() {
    const session = await auth();
    const teacher = await prisma.teacher.findUnique({
        where: { email: session?.user?.email! }
    });
    if (!teacher) throw new Error("Teacher not found");
    return teacher;
}

// ─── Assignments ───────────────────────────────────────────────────
export async function createAssignment(prevState: any, formData: FormData) {
    const teacher = await getTeacher();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dueDate = formData.get("dueDate") as string;
    const courseId = formData.get("courseId") as string;

    if (!title || !dueDate || !courseId) {
        return { success: false, message: "All fields are required." };
    }

    try {
        await prisma.assignment.create({
            data: { title, description, dueDate: new Date(dueDate), courseId, teacherId: teacher.id }
        });
        revalidatePath("/teacher/assignments");
        return { success: true, message: "Assignment created successfully." };
    } catch {
        return { success: false, message: "Failed to create assignment." };
    }
}

export async function deleteAssignment(id: string) {
    await prisma.assignment.delete({ where: { id } });
    revalidatePath("/teacher/assignments");
}

// ─── Attendance ─────────────────────────────────────────────────────
export async function markAttendance(prevState: any, formData: FormData) {
    const studentId = formData.get("studentId") as string;
    const courseId = formData.get("courseId") as string;
    const date = formData.get("date") as string;
    const status = formData.get("status") as string;
    const remarks = formData.get("remarks") as string;
    const existingId = formData.get("existingId") as string;

    if (!studentId || !courseId || !date || !status) {
        return { success: false, message: "All required fields must be filled." };
    }

    try {
        if (existingId) {
            await prisma.attendance.update({
                where: { id: existingId },
                data: { status, remarks: remarks || null },
            });
        } else {
            await prisma.attendance.create({
                data: {
                    studentId, courseId,
                    date: new Date(date),
                    status,
                    remarks: remarks || null,
                },
            });
        }
        revalidatePath("/teacher/attendance");
        return { success: true, message: "Attendance saved." };
    } catch {
        return { success: false, message: "Failed to save attendance." };
    }
}

// ─── Grades ─────────────────────────────────────────────────────────
export async function saveGrade(prevState: any, formData: FormData) {
    const studentId = formData.get("studentId") as string;
    const courseId = formData.get("courseId") as string;
    const assignmentId = formData.get("assignmentId") as string;
    const marks = parseFloat(formData.get("marks") as string);
    const remarks = formData.get("remarks") as string;
    const existingId = formData.get("existingId") as string;

    if (!studentId || !courseId || isNaN(marks)) {
        return { success: false, message: "Student, course, and marks are required." };
    }

    const gradeLabel = marks >= 90 ? "A" : marks >= 80 ? "B" : marks >= 70 ? "C" : marks >= 60 ? "D" : "F";

    try {
        if (existingId) {
            await prisma.grade.update({
                where: { id: existingId },
                data: { marks, gradeLabel, remarks: remarks || null },
            });
        } else {
            await prisma.grade.create({
                data: {
                    studentId, courseId,
                    assignmentId: assignmentId || null,
                    marks, gradeLabel,
                    remarks: remarks || null,
                },
            });
        }
        revalidatePath("/teacher/grades");
        return { success: true, message: "Grade saved." };
    } catch {
        return { success: false, message: "Failed to save grade." };
    }
}

export async function deleteGrade(id: string) {
    await prisma.grade.delete({ where: { id } });
    revalidatePath("/teacher/grades");
}
