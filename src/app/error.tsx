"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Application Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-6 text-center">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-rose-100/50 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 max-w-lg w-full bg-white p-12 rounded-3xl shadow-xl shadow-rose-100/50 border border-rose-50">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <AlertTriangle className="w-10 h-10 text-rose-600" />
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    Something went wrong!
                </h1>
                
                <p className="text-slate-600 mb-8 leading-relaxed">
                    An unexpected error occurred. Our team has been notified. 
                    Please try refreshing the page or head back to the home page.
                </p>

                {error.digest && (
                    <div className="bg-slate-50 p-3 rounded-lg text-xs font-mono text-slate-400 mb-8">
                        Error ID: {error.digest}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 active:scale-95"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Try Again
                    </button>
                    
                    <Link 
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <Home className="w-5 h-5" />
                        Home Page
                    </Link>
                </div>
            </div>

            <footer className="absolute bottom-10 text-slate-400 text-sm">
                If the problem persists, please contact the school administration.
            </footer>
        </div>
    );
}
