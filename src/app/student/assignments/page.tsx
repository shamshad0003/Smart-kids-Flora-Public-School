import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BookOpen, Clock, CalendarDays } from "lucide-react";
import SafeDate from "@/components/ui/SafeDate";

export default async function StudentAssignmentsPage() {
    const session = await auth();
    const student = await prisma.student.findUnique({ where: { email: session?.user?.email! } });
    if (!student) redirect("/login");

    const courses = await prisma.course.findMany({
        where: { gradeLevel: student.gradeLevel },
        include: {
            assignments: { orderBy: { dueDate: "asc" } },
            teacher: true
        }
    });

    const allAssignments = courses.flatMap(c => c.assignments.map(a => ({ ...a, courseName: c.name, teacherName: c.teacher.fullName })));
    const upcoming = allAssignments.filter(a => new Date(a.dueDate) >= new Date());
    const past = allAssignments.filter(a => new Date(a.dueDate) < new Date());

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Assignments</h1>
                <p className="text-slate-500 text-sm mt-1">View all assignments for your courses.</p>
            </div>

            {/* Upcoming */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <h2 className="font-bold text-slate-900">Upcoming ({upcoming.length})</h2>
                </div>
                {upcoming.length === 0 ? (
                    <p className="px-6 py-10 text-slate-400 text-center">No upcoming assignments. 🎉</p>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {upcoming.map((a) => (
                            <div key={a.id} className="px-6 py-4 flex items-start justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center shrink-0">
                                        <BookOpen className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{a.title}</p>
                                        <p className="text-sm text-slate-500">{a.courseName} · {a.teacherName}</p>
                                        {a.description && <p className="text-xs text-slate-400 mt-1">{a.description}</p>}
                                    </div>
                                </div>
                                <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full shrink-0 ml-4">
                                    Due <SafeDate date={a.dueDate} />
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past */}
            {past.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center space-x-2">
                        <CalendarDays className="h-5 w-5 text-slate-400" />
                        <h2 className="font-bold text-slate-900">Past Assignments ({past.length})</h2>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {past.map((a) => (
                            <div key={a.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors opacity-70">
                                <div>
                                    <p className="font-medium text-slate-700">{a.title}</p>
                                    <p className="text-sm text-slate-400">{a.courseName}</p>
                                </div>
                                <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-500 rounded-full shrink-0">
                                    <SafeDate date={a.dueDate} />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
