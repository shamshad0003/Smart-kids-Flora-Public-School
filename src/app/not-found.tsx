"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-md w-full">
                <div className="text-9xl font-black text-slate-200 mb-4 select-none">404</div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    Oops! Page Not Found
                </h1>
                
                <p className="text-slate-600 mb-10 leading-relaxed">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
                    Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                    
                    <button 
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>
            </div>

            <footer className="absolute bottom-10 text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} Smart Kids Flora Public School. All rights reserved.
            </footer>
        </div>
    );
}
