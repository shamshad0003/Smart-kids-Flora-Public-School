import React from "react";
import { Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ComingSoonProps {
    title: string;
    description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mb-6">
                <Construction className="h-10 w-10 text-amber-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{title}</h1>
            <p className="text-slate-500 max-w-md mb-8">
                {description ?? "This section is under construction and will be available in Phase 3. Full CRUD functionality coming soon."}
            </p>
            <Link
                href="/admin"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
            </Link>
        </div>
    );
}
