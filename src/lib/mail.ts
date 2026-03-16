// src/lib/mail.ts
// Email notification utility - uses nodemailer with env-based SMTP config
// Falls back to console.log if SMTP not configured (non-blocking)

import nodemailer from "nodemailer";

interface AdmissionEmailData {
    studentName: string;
    parentName: string;
    email: string;
    phone: string;
    grade: string;
    message?: string | null;
}

export async function sendAdmissionAlert(data: AdmissionEmailData): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT ?? "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const body = `
New Admission Application Received

Student Name: ${data.studentName}
Parent Name:  ${data.parentName}
Email:        ${data.email}
Phone:        ${data.phone}
Grade:        ${data.grade}
Message:      ${data.message ?? "N/A"}

Please review in the Admin Portal > Admissions.
    `.trim();

    // If SMTP not configured, just log
    if (!smtpHost || !smtpUser || !smtpPass || !adminEmail) {
        console.log("[MAIL] SMTP not configured. Admission alert would have been sent:");
        console.log(body);
        return;
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
        from: `"Flora Public School" <${smtpUser}>`,
        to: adminEmail,
        subject: `New Admission: ${data.studentName}`,
        text: body,
    });
}
