import { CardSkeleton, TableSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function TeacherLoading() {
    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>

            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <TableSkeleton rows={4} cols={4} />
            </div>
        </div>
    );
}
