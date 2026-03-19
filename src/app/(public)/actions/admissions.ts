"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendAdmissionAlert } from "@/lib/mail";
import { z } from "zod";

const AdmissionSchema = z.object({
    studentName: z.string().min(3, "Student name must be at least 3 characters"),
    parentName: z.string().min(3, "Parent name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    grade: z.string().min(1, "Please select a grade"),
    message: z.string().optional(),
});

export type AdmissionState = {
    errors?: Record<string, string[]>;
    message?: string;
    success?: boolean;
};

export async function submitAdmission(prevState: AdmissionState, formData: FormData): Promise<AdmissionState> {
    try {
        const validatedFields = AdmissionSchema.safeParse({
            studentName: formData.get("studentName"),
            parentName: formData.get("parentName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            grade: formData.get("grade"),
            message: formData.get("message"),
        });

        if (!validatedFields.success) {
            return { 
                errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>, 
                message: "Please correct the errors in the form." 
            };
        }

        const data = validatedFields.data;

        await prisma.admission.create({
            data: {
                studentName: data.studentName,
                parentName: data.parentName,
                email: data.email,
                phone: data.phone,
                grade: data.grade,
                message: data.message || null,
                status: "PENDING",
            },
        });

        revalidatePath("/admin/admissions");

        // Non-blocking email alert — never throws to user
        sendAdmissionAlert(data).catch((err) => {
            console.error("[MAIL] Failed to send admission alert:", err);
        });

        return {
            success: true,
            message: "Application submitted successfully! Our team will contact you soon.",
        };
    } catch (error) {
        console.error("Admission submission error:", error);
        return {
            message: "Something went wrong. Please try again later.",
            success: false,
        };
    }
}
