import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-slate-200/60", className)}
            {...props}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-3 w-3/4 mt-2" />
        </div>
    );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number, cols?: number }) {
    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
            </div>
            <div className="p-4">
                <div className="flex gap-4 mb-4">
                    {Array.from({ length: cols }).map((_, i) => (
                        <Skeleton key={i} className="h-4 flex-1" />
                    ))}
                </div>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex gap-4 mb-4 py-2 border-b border-slate-50 last:border-0">
                        {Array.from({ length: cols }).map((_, j) => (
                            <Skeleton key={j} className="h-3 flex-1" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
