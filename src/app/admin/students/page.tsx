import { prisma } from "@/lib/prisma";
import StudentManager from "@/components/admin/StudentManager";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import { Suspense } from "react";

const PER_PAGE = 15;

export default async function StudentsPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string>>;
}) {
    const params = await searchParams;
    const q = params.q ?? "";
    const page = Number(params.page ?? "1");

    const where = q
        ? {
            OR: [
                { fullName: { contains: q, mode: "insensitive" as const } },
                { email: { contains: q, mode: "insensitive" as const } },
                { gradeLevel: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {};

    const [students, parents, total] = await Promise.all([
        prisma.student.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * PER_PAGE,
            take: PER_PAGE,
        }),
        prisma.parent.findMany({ orderBy: { fullName: "asc" } }),
        prisma.student.count({ where }),
    ]);

    const totalPages = Math.ceil(total / PER_PAGE);

    return (
        <div className="max-w-7xl mx-auto space-y-5">
            <Suspense>
                <SearchBar placeholder="Search by name, email or grade..." />
            </Suspense>
            <StudentManager students={students} parents={parents} />
            <Suspense>
                <Pagination page={page} totalPages={totalPages} />
            </Suspense>
        </div>
    );
}
