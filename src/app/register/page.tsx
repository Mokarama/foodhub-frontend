'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '@/src/utils/validation';
import { registerUser } from '@/src/services/auth';
import { IoPersonCircle, IoMail, IoLockClosed } from 'react-icons/io5';

/**
 * Register Page — Premium design with role selection
 */
export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!form.name) {
      newErrors.push('Name is required');
    } else if (!validateName(form.name)) {
      newErrors.push('Name must be at least 2 characters');
    }

    if (!form.email) {
      newErrors.push('Email is required');
    } else if (!validateEmail(form.email)) {
      newErrors.push('Invalid email format');
    }

    if (!form.password) {
      newErrors.push('Password is required');
    } else {
      const pwdErrors = validatePassword(form.password);
      if (pwdErrors.length > 0) {
        newErrors.push(...pwdErrors);
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await registerUser(form);
      alert('Account successfully created! Please log in with your new credentials.');
      router.push('/login');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
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
          <div className="absolute top-20 right-20 text-8xl animate-float">
            🍱
          </div>
          <div className="absolute bottom-10 left-10 text-7xl animate-float animate-delay-300">
            🥘
          </div>
          <div className="absolute top-1/3 left-1/4 text-9xl animate-float animate-delay-200">
            🍜
          </div>
        </div>
        <div className="relative z-10 text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4">Join FoodHub</h2>
          <p className="text-white/80 text-lg max-w-sm">
            Create an account to start ordering delicious meals or become a food
            provider.
          </p>
        </div>
      </div>

      {/* Right — Register Form */}
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
            Create Account
          </h1>
          <p className="text-gray-500 mb-8">
            Fill in your details to get started
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
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <IoPersonCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  value={form.name}
                />
              </div>
            </div>

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
              <p className="text-xs text-gray-400 mt-1.5">
                Min 6 chars, 1 uppercase, 1 number
              </p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'CUSTOMER' })}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    form.role === 'CUSTOMER'
                      ? 'border-orange-500 bg-orange-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">🛒</span>
                  <span
                    className={`text-sm font-semibold ${form.role === 'CUSTOMER' ? 'text-orange-700' : 'text-gray-600'}`}
                  >
                    Order Meals
                  </span>
                  <span className="block text-xs text-gray-400">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'PROVIDER' })}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    form.role === 'PROVIDER'
                      ? 'border-orange-500 bg-orange-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">🍳</span>
                  <span
                    className={`text-sm font-semibold ${form.role === 'PROVIDER' ? 'text-orange-700' : 'text-gray-600'}`}
                  >
                    Sell Meals
                  </span>
                  <span className="block text-xs text-gray-400">Provider</span>
                </button>
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-orange-600 font-semibold hover:text-orange-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
