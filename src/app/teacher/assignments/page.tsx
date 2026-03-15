import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TeacherAssignmentsClient from "./AssignmentsClient";

export default async function TeacherAssignmentsPage() {
    const session = await auth();
    const teacher = await prisma.teacher.findUnique({
        where: { email: session?.user?.email! },
        include: {
            courses: true,
            assignments: {
                orderBy: { dueDate: "asc" },
                include: { course: true }
            }
        }
    });

    if (!teacher) redirect("/login");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Assignments</h1>
                <p className="text-slate-500 text-sm mt-1">Create and manage assignments for your courses.</p>
            </div>
            <TeacherAssignmentsClient
                assignments={teacher.assignments}
                courses={teacher.courses}
            />
        </div>
    );
}
