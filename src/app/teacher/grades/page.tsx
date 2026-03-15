import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import GradesClient from "./GradesClient";

export default async function TeacherGradesPage() {
    const session = await auth();
    const teacher = await prisma.teacher.findUnique({
        where: { email: session?.user?.email! },
        include: {
            courses: {
                include: {
                    assignments: true,
                    grades: {
                        include: { student: true, assignment: true },
                        orderBy: { createdAt: "desc" },
                    }
                }
            }
        }
    });

    if (!teacher) redirect("/login");

    const students = await prisma.student.findMany({
        where: { gradeLevel: { in: teacher.courses.map(c => c.gradeLevel) } }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Grades</h1>
                <p className="text-slate-500 text-sm mt-1">Add and manage student grades for your courses.</p>
            </div>
            <GradesClient courses={teacher.courses} students={students} />
        </div>
    );
}
