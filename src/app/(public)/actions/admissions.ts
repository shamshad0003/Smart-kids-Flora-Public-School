"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendAdmissionAlert } from "@/lib/mail";

export type AdmissionState = {
    errors?: {
        studentName?: string[];
        parentName?: string[];
        email?: string[];
        phone?: string[];
        grade?: string[];
        message?: string[];
    };
    message?: string;
    success?: boolean;
};

export async function submitAdmission(prevState: AdmissionState, formData: FormData): Promise<AdmissionState> {
    const studentName = formData.get("studentName") as string;
    const parentName = formData.get("parentName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const grade = formData.get("grade") as string;
    const message = formData.get("message") as string;

    // Basic validation
    const errors: AdmissionState["errors"] = {};
    if (!studentName || studentName.length < 3) errors.studentName = ["Student name is required and must be at least 3 characters."];
    if (!parentName || parentName.length < 3) errors.parentName = ["Parent name is required and must be at least 3 characters."];
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = ["A valid email is required."];
    if (!phone || phone.length < 10) errors.phone = ["A valid phone number is required."];
    if (!grade) errors.grade = ["Please select a grade."];

    if (Object.keys(errors).length > 0) {
        return { errors, message: "Please correct the errors in the form." };
    }

    try {
        await prisma.admission.create({
            data: {
                studentName,
                parentName,
                email,
                phone,
                grade,
                message: message || null,
                status: "PENDING",
            },
        });

        revalidatePath("/admin/admissions");

        // Non-blocking email alert — never throws to user
        sendAdmissionAlert({ studentName, parentName, email, phone, grade, message }).catch((err) => {
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
