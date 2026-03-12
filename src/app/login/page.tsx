"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/admin";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password. Please try again.");
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-blue-800 to-slate-900 flex items-center justify-center p-4">
            {/* Background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-32 h-32 border-4 border-white rounded-full translate-x-8 -translate-y-8"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 border-4 border-white rounded-full -translate-x-6 translate-y-6"></div>
                        </div>
                        <div className="relative z-10 space-y-3">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg">
                                <GraduationCap className="h-9 w-9" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-white">Admin Portal</h1>
                                <p className="text-blue-100/70 text-sm mt-1">Smart Kids Flora Public School</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8 space-y-6">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900">Welcome back</h2>
                            <p className="text-slate-500 text-sm mt-1">Sign in to access your dashboard</p>
                        </div>

                        {/* Demo Credentials Banner */}
                        <div className="flex items-start space-x-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-bold text-amber-800">Demo Credentials</p>
                                <p className="text-amber-700">Email: <span className="font-mono">admin@florapublic.edu</span></p>
                                <p className="text-amber-700">Password: <span className="font-mono">Admin@123</span></p>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@florapublic.edu"
                                        autoComplete="email"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition text-sm"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-primary text-white font-extrabold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <span>Sign In to Dashboard</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-center text-white/40 text-xs mt-6">
                    &copy; {new Date().getFullYear()} Smart Kids Flora Public School — Admin Portal
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
