import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    trend?: number;   // positive = up, negative = down, 0 = flat
    trendLabel?: string;
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    iconColor,
    iconBg,
    trend,
    trendLabel,
}: StatsCardProps) {
    const TrendIcon =
        trend === undefined || trend === 0
            ? Minus
            : trend > 0
                ? TrendingUp
                : TrendingDown;
    const trendColor =
        trend === undefined || trend === 0
            ? "text-slate-400"
            : trend > 0
                ? "text-emerald-500"
                : "text-red-500";
    const trendBg =
        trend === undefined || trend === 0
            ? "bg-slate-100"
            : trend > 0
                ? "bg-emerald-50"
                : "bg-red-50";

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${trendBg} ${trendColor}`}>
                        <TrendIcon className="h-3 w-3" />
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            <div>
                <p className="text-3xl font-extrabold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{title}</p>
                {trendLabel && (
                    <p className="text-xs text-slate-400 mt-1">{trendLabel}</p>
                )}
            </div>
        </div>
    );
}
