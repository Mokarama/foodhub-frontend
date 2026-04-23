'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/src/context/AuthContext';
import { validateEmail } from '@/src/utils/validation';
import { loginUser } from '@/src/services/auth';
import { IoMail, IoLockClosed } from 'react-icons/io5';

/**
 * Login Page — Premium design with gradient sidebar and form validation
 */
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthContext();

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    if (!form.email) {
      newErrors.push('Email is required');
    } else if (!validateEmail(form.email)) {
      newErrors.push('Invalid email format');
    }
    if (!form.password) {
      newErrors.push('Password is required');
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await loginUser(form);
      await login(res.data.token);
      router.push('/');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setErrors([errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-float">🍕</div>
          <div className="absolute bottom-20 right-10 text-7xl animate-float animate-delay-300">🍔</div>
          <div className="absolute top-1/2 left-1/3 text-9xl animate-float animate-delay-200">🥗</div>
        </div>
        <div className="relative z-10 text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4">Welcome Back!</h2>
          <p className="text-white/80 text-lg max-w-sm">
            Sign in to order delicious meals from your favorite providers.
          </p>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md animate-fadeInUp">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <span className="text-3xl">🍕</span>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              FoodHub
            </span>
          </Link>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Sign In
          </h1>
          <p className="text-gray-500 mb-8">
            Enter your credentials to access your account
          </p>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-fadeInDown">
              {errors.map((error, idx) => (
                <p key={idx} className="text-sm">
                  • {error}
                </p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  value={form.email}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  value={form.password}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-orange-600 font-semibold hover:text-orange-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
