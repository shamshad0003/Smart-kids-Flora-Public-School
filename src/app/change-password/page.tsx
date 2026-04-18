'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { updatePassword } from './actions';
import { useSession } from 'next-auth/react';

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await updatePassword(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Update session to reflect mustChangePassword = false
      await update({ mustChangePassword: false });
      
      // Redirect based on role
      const role = (session?.user as any)?.role;
      if (role === 'ADMIN') router.push('/admin');
      else if (role === 'TEACHER') router.push('/teacher');
      else if (role === 'STUDENT') router.push('/student');
      else if (role === 'PARENT') router.push('/parent');
      else router.push('/');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-3xl mb-4">
            <Lock className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Welcome to Smart Kids Portal</h1>
          <p className="text-slate-500 font-medium">To protect your account, please set a new permanent password for your first login.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm font-bold flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Current Temporary Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="w-5 h-5 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    required
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all font-medium"
                    placeholder="Enter temp password"
                  />
                </div>
              </div>

              <div className="h-px bg-slate-100 my-4" />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">New Permanent Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    required
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all font-medium"
                    placeholder="Minimal 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-pink-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Confirm New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all font-medium"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-slate-200"
            >
              <span>{loading ? 'Changing Password...' : 'Update & Access Dashboard'}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-slate-400 text-sm font-medium">
          Having trouble? Contact your school administrator.
        </p>
      </div>
    </div>
  );
}
