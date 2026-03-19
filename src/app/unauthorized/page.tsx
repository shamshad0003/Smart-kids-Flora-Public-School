"use client";

import { ShieldAlert, ArrowLeft, Home, LogIn } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-100/50 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 max-w-lg w-full bg-white p-12 rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-50">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShieldAlert className="w-10 h-10 text-amber-600" />
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    Access Denied
                </h1>
                
                <p className="text-slate-600 mb-8 leading-relaxed">
                    You do not have the necessary permissions to access this page. 
                    If you believe this is an error, please try logging in again with an authorized account.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        href="/login"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                        <LogIn className="w-5 h-5" />
                        Login Page
                    </Link>
                    
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
                &copy; {new Date().getFullYear()} Smart Kids Flora Public School. All rights reserved.
            </footer>
        </div>
    );
}
