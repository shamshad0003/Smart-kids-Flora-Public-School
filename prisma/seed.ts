import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    const hashedAdmin = await bcrypt.hash("Admin@123", 10);
    const hashedTeacher = await bcrypt.hash("Teacher@123", 10);
    const hashedStudent = await bcrypt.hash("Student@123", 10);
    const hashedParent = await bcrypt.hash("Parent@123", 10);

    // ─── Admin User ─────────────────────────────────────────────
    await prisma.user.upsert({
        where: { email: "admin@florapublic.edu" },
        update: {},
        create: {
            name: "School Admin",
            email: "admin@florapublic.edu",
            password: hashedAdmin,
            role: "ADMIN",
        },
    });

    // ─── Teacher User ─────────────────────────────────────────────
    const teacherUser = await prisma.user.upsert({
        where: { email: "teacher@florapublic.edu" },
        update: {},
        create: {
            name: "Mr. Ahmed Raza",
            email: "teacher@florapublic.edu",
            password: hashedTeacher,
            role: "TEACHER",
        },
    });

    const teacher = await prisma.teacher.upsert({
        where: { userId: teacherUser.id },
        update: {},
        create: {
            userId: teacherUser.id,
            fullName: "Mr. Ahmed Raza",
            email: "teacher@florapublic.edu",
            phone: "0300-1111111",
            subject: "Mathematics",
        },
    });

    // ─── Student User ─────────────────────────────────────────────
    const studentUser = await prisma.user.upsert({
        where: { email: "student@florapublic.edu" },
        update: {},
        create: {
            name: "Ali Hassan",
            email: "student@florapublic.edu",
            password: hashedStudent,
            role: "STUDENT",
        },
    });

    // ─── Parent User ─────────────────────────────────────────────
    const parentUser = await prisma.user.upsert({
        where: { email: "parent@florapublic.edu" },
        update: {},
        create: {
            name: "Hassan Shah",
            email: "parent@florapublic.edu",
            password: hashedParent,
            role: "PARENT",
        },
    });

    const parent = await prisma.parent.upsert({
        where: { userId: parentUser.id },
        update: {},
        create: {
            userId: parentUser.id,
            fullName: "Hassan Shah",
            email: "parent@florapublic.edu",
            phone: "0300-4444444",
        },
    });

    const student = await prisma.student.upsert({
        where: { userId: studentUser.id },
        update: {},
        create: {
            userId: studentUser.id,
            fullName: "Ali Hassan",
            email: "student@florapublic.edu",
            phone: "0300-3333333",
            gradeLevel: "Class 8",
            parentId: parent.id,
        },
    });

    // ─── Courses ─────────────────────────────────────────────────
    const course = await prisma.course.upsert({
        where: { id: "course-math-8" },
        update: {},
        create: {
            id: "course-math-8",
            name: "Mathematics – Class 8",
            subject: "Mathematics",
            gradeLevel: "Class 8",
            teacherId: teacher.id,
        },
    });

    const course2 = await prisma.course.upsert({
        where: { id: "course-sci-8" },
        update: {},
        create: {
            id: "course-sci-8",
            name: "Science – Class 8",
            subject: "Science",
            gradeLevel: "Class 8",
            teacherId: teacher.id,
        },
    });

    // ─── Assignments ─────────────────────────────────────────────
    const assignment1 = await prisma.assignment.upsert({
        where: { id: "assign-1" },
        update: {},
        create: {
            id: "assign-1",
            title: "Algebra Chapter 3 – Practice Problems",
            description: "Complete exercises 1–20 from chapter 3 of the textbook.",
            dueDate: new Date("2026-03-25"),
            courseId: course.id,
            teacherId: teacher.id,
        },
    });

    const assignment2 = await prisma.assignment.upsert({
        where: { id: "assign-2" },
        update: {},
        create: {
            id: "assign-2",
            title: "Geometry – Area and Perimeter",
            description: "Solve the worksheet on area and perimeter of various shapes.",
            dueDate: new Date("2026-04-01"),
            courseId: course.id,
            teacherId: teacher.id,
        },
    });

    await prisma.assignment.upsert({
        where: { id: "assign-3" },
        update: {},
        create: {
            id: "assign-3",
            title: "Science Lab Report – Photosynthesis",
            description: "Write a lab report on the photosynthesis experiment.",
            dueDate: new Date("2026-03-28"),
            courseId: course2.id,
            teacherId: teacher.id,
        },
    });

    // ─── Attendance ───────────────────────────────────────────────
    await prisma.attendance.upsert({
        where: { id: "att-1" },
        update: {},
        create: {
            id: "att-1",
            studentId: student.id,
            courseId: course.id,
            date: new Date("2026-03-10"),
            status: "PRESENT",
        },
    });

    await prisma.attendance.upsert({
        where: { id: "att-2" },
        update: {},
        create: {
            id: "att-2",
            studentId: student.id,
            courseId: course.id,
            date: new Date("2026-03-11"),
            status: "PRESENT",
        },
    });

    await prisma.attendance.upsert({
        where: { id: "att-3" },
        update: {},
        create: {
            id: "att-3",
            studentId: student.id,
            courseId: course.id,
            date: new Date("2026-03-12"),
            status: "ABSENT",
            remarks: "Sick leave",
        },
    });

    await prisma.attendance.upsert({
        where: { id: "att-4" },
        update: {},
        create: {
            id: "att-4",
            studentId: student.id,
            courseId: course2.id,
            date: new Date("2026-03-10"),
            status: "PRESENT",
        },
    });

    // ─── Grades ───────────────────────────────────────────────────
    await prisma.grade.upsert({
        where: { id: "grade-1" },
        update: {},
        create: {
            id: "grade-1",
            studentId: student.id,
            courseId: course.id,
            assignmentId: assignment1.id,
            marks: 88,
            gradeLabel: "B",
            remarks: "Good work, keep it up!",
        },
    });

    await prisma.grade.upsert({
        where: { id: "grade-2" },
        update: {},
        create: {
            id: "grade-2",
            studentId: student.id,
            courseId: course.id,
            assignmentId: assignment2.id,
            marks: 95,
            gradeLabel: "A",
            remarks: "Excellent performance!",
        },
    });

    await prisma.grade.upsert({
        where: { id: "grade-3" },
        update: {},
        create: {
            id: "grade-3",
            studentId: student.id,
            courseId: course2.id,
            marks: 78,
            gradeLabel: "B",
        },
    });

    // ─── Notifications ────────────────────────────────────────────
    const notifications = [
        {
            id: "notif-1",
            title: "Welcome to the Portal!",
            message: "Your school management portal is now live. Explore your dashboard to get started.",
            targetRole: "ALL",
        },
        {
            id: "notif-2",
            title: "Math Assignment Due Soon",
            message: "Reminder: Algebra Chapter 3 practice problems are due on March 25, 2026.",
            targetRole: "STUDENT",
        },
        {
            id: "notif-3",
            title: "Attendance Report Available",
            message: "The monthly attendance report is now available in your dashboard.",
            targetRole: "PARENT",
        },
        {
            id: "notif-4",
            title: "Grade Entry Reminder",
            message: "Please ensure all student grades for Chapter 3 are entered by end of week.",
            targetRole: "TEACHER",
        },
    ];

    for (const notif of notifications) {
        await prisma.notification.upsert({
            where: { id: notif.id },
            update: {},
            create: notif,
        });
    }

    // ─── Sample Announcement & Event ─────────────────────────────
    await prisma.announcement.upsert({
        where: { id: "announce-1" },
        update: {},
        create: {
            id: "announce-1",
            title: "Admission Open for 2026-27",
            content: "We are now accepting applications for the upcoming academic year. Apply online today!",
            category: "Admissions",
            published: true,
        },
    });

    await prisma.event.upsert({
        where: { id: "event-1" },
        update: {},
        create: {
            id: "event-1",
            title: "Annual Sports Day 2026",
            description: "A day full of athletic events for all students. Parents are invited.",
            location: "School Sports Ground",
            eventDate: new Date("2026-04-15"),
        },
    });

    console.log("✅ Seed complete!");
    console.log("\n📋 Demo Credentials:");
    console.log("  Admin:   admin@florapublic.edu   / Admin@123");
    console.log("  Teacher: teacher@florapublic.edu / Teacher@123");
    console.log("  Student: student@florapublic.edu / Student@123");
    console.log("  Parent:  parent@florapublic.edu  / Parent@123");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
