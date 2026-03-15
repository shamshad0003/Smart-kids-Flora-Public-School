import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AttendanceClient from "./AttendanceClient";

export default async function TeacherAttendancePage() {
    const session = await auth();
    const teacher = await prisma.teacher.findUnique({
        where: { email: session?.user?.email! },
        include: {
            courses: {
                include: {
                    attendances: {
                        include: { student: true },
                        orderBy: { date: "desc" },
                        take: 30
                    }
                }
            }
        }
    });

    if (!teacher) redirect("/login");

    // Fetch all students linked to teacher's courses
    const students = await prisma.student.findMany({
        where: { gradeLevel: { in: teacher.courses.map(c => c.gradeLevel) } }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Attendance</h1>
                <p className="text-slate-500 text-sm mt-1">Mark and manage student attendance records.</p>
            </div>
            <AttendanceClient courses={teacher.courses} students={students} />
        </div>
    );
}
