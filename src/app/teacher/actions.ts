"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireTeacher, getCurrentUser } from "@/lib/auth-utils";
import { z } from "zod";

async function getTeacherProfile() {
    const user = await getCurrentUser();
    if (!user?.email) throw new Error("Unauthorized");
    
    const teacher = await prisma.teacher.findUnique({
        where: { email: user.email }
    });
    if (!teacher) throw new Error("Teacher profile not found");
    return teacher;
}

const AssignmentSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    dueDate: z.string().min(1, "Due date is required"),
    courseId: z.string().min(1, "Course is required"),
});

const AttendanceSchema = z.object({
    studentId: z.string().min(1),
    courseId: z.string().min(1),
    date: z.string().min(1),
    status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
    remarks: z.string().optional(),
    existingId: z.string().optional(),
});

const GradeSchema = z.object({
    studentId: z.string().min(1),
    courseId: z.string().min(1),
    assignmentId: z.string().optional(),
    marks: z.coerce.number().min(0).max(100),
    remarks: z.string().optional(),
    existingId: z.string().optional(),
});

// ─── Assignments ───────────────────────────────────────────────────
export async function createAssignment(prevState: any, formData: FormData) {
    try {
        await requireTeacher();
        const teacher = await getTeacherProfile();

        const validatedFields = AssignmentSchema.safeParse({
            title: formData.get("title"),
            description: formData.get("description"),
            dueDate: formData.get("dueDate"),
            courseId: formData.get("courseId"),
        });

        if (!validatedFields.success) {
            return { success: false, message: "Validation failed", errors: validatedFields.error.flatten().fieldErrors };
        }

        const { title, description, dueDate, courseId } = validatedFields.data;

        await prisma.assignment.create({
            data: { 
                title, 
                description: description || null, 
                dueDate: new Date(dueDate), 
                courseId, 
                teacherId: teacher.id 
            }
        });
        revalidatePath("/teacher/assignments");
        return { success: true, message: "Assignment created successfully." };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to create assignment." };
    }
}

export async function deleteAssignment(id: string) {
    try {
        await requireTeacher();
        await prisma.assignment.delete({ where: { id } });
        revalidatePath("/teacher/assignments");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── Attendance ─────────────────────────────────────────────────────
export async function markAttendance(prevState: any, formData: FormData) {
    try {
        await requireTeacher();

        const validatedFields = AttendanceSchema.safeParse({
            studentId: formData.get("studentId"),
            courseId: formData.get("courseId"),
            date: formData.get("date"),
            status: formData.get("status"),
            remarks: formData.get("remarks"),
            existingId: formData.get("existingId"),
        });

        if (!validatedFields.success) {
            return { success: false, message: "Validation failed", errors: validatedFields.error.flatten().fieldErrors };
        }

        const { studentId, courseId, date, status, remarks, existingId } = validatedFields.data;

        if (existingId) {
            await prisma.attendance.update({
                where: { id: existingId },
                data: { status, remarks: remarks || null },
            });
        } else {
            await prisma.attendance.create({
                data: {
                    studentId,
                    courseId,
                    date: new Date(date),
                    status,
                    remarks: remarks || null,
                },
            });
        }
        revalidatePath("/teacher/attendance");
        return { success: true, message: "Attendance saved." };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to save attendance." };
    }
}

// ─── Grades ─────────────────────────────────────────────────────────
export async function saveGrade(prevState: any, formData: FormData) {
    try {
        await requireTeacher();

        const validatedFields = GradeSchema.safeParse({
            studentId: formData.get("studentId"),
            courseId: formData.get("courseId"),
            assignmentId: formData.get("assignmentId"),
            marks: formData.get("marks"),
            remarks: formData.get("remarks"),
            existingId: formData.get("existingId"),
        });

        if (!validatedFields.success) {
            return { success: false, message: "Validation failed", errors: validatedFields.error.flatten().fieldErrors };
        }

        const { studentId, courseId, assignmentId, marks, remarks, existingId } = validatedFields.data;
        const gradeLabel = marks >= 90 ? "A" : marks >= 80 ? "B" : marks >= 70 ? "C" : marks >= 60 ? "D" : "F";

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
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to save grade." };
    }
}

export async function deleteGrade(id: string) {
    try {
        await requireTeacher();
        await prisma.grade.delete({ where: { id } });
        revalidatePath("/teacher/grades");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
