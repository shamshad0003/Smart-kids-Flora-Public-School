import { CardSkeleton, TableSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>

            <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <TableSkeleton rows={6} cols={5} />
            </div>
        </div>
    );
}
