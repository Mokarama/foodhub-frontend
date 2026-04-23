'use client';

import React from 'react';
import { useAuthContext } from '@/src/context/AuthContext';
import { Card, Button, Loading } from '@/src/components/ui';
import { IoPersonOutline, IoMailOutline, IoShieldOutline, IoTimeOutline, IoArrowForward } from 'react-icons/io5';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) return <div className="p-20 text-center"><Loading /></div>;
  if (!user) return <div className="p-20 text-center text-gray-500">Please login to view your profile.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fadeInUp">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-2">Manage your personal information and account security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Avatar & Quick Info */}
        <div className="space-y-6">
          <Card className="p-8 text-center bg-gradient-to-b from-orange-50 to-white">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl mx-auto mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-6">{user.role}</p>
            <div className="flex justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">Active</span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">Verified</span>
            </div>
          </Card>

          <div className="space-y-2">
            <Link href="/dashboard" className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all group">
               <span className="text-sm font-semibold text-gray-700">Dashboard</span>
               <IoArrowForward className="text-gray-400 group-hover:text-orange-500 transition-colors" />
            </Link>
            {user.role === 'CUSTOMER' && (
              <Link href="/orders" className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all group">
                 <span className="text-sm font-semibold text-gray-700">My Orders</span>
                 <IoArrowForward className="text-gray-400 group-hover:text-orange-500 transition-colors" />
              </Link>
            )}
          </div>
        </div>

        {/* Right: Detailed Form/Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <IoPersonOutline className="text-orange-500" /> Personal Details
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <IoPersonOutline className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <IoMailOutline className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Role</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <IoShieldOutline className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user.role}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Member Since</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <IoTimeOutline className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">October 2023</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
              <Button disabled variant="outline" className="opacity-50">
                Update Profile (Coming Soon)
              </Button>
            </div>
          </Card>

          <Card className="p-8 border-red-100 bg-red-50/30">
            <h3 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              Deactivate Account
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
