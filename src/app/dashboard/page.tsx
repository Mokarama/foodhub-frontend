'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';
import { useAuthContext } from '@/src/context/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserOrders, getMeals } from '@/src/lib/api';
import { Card, Loading } from '@/src/components/ui';
import { Order } from '@/src/types';
import {
  IoRestaurant,
  IoReceipt,
  IoGrid,
  IoStar,
  IoPeople,
  IoArrowForward,
  IoShieldCheckmark,
  IoFastFood,
} from 'react-icons/io5';

/**
 * Dashboard — Role-based dashboard with real data
 * - CUSTOMER: Recent orders, quick actions
 * - PROVIDER: Meal count, recent stats
 * - ADMIN: Platform overview with links to admin pages
 */
export default function Dashboard() {
  const { user, isLoading } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [mealCount, setMealCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        if (user.role === 'CUSTOMER') {
          const res = await getUserOrders();
          setOrders(res.data);
        } else if (user.role === 'PROVIDER') {
          const res = await getMeals();
          // Filter meals by this provider
          const myMeals = res.data.filter(
            (m: any) => m.providerId === user.id,
          );
          setMealCount(myMeals.length);
        }
      } catch (err) {
        // silent fail for dashboard
      } finally {
        setDataLoading(false);
      }
    };
    if (!isLoading && user) fetchDashboardData();
  }, [isLoading, user]);

  if (isLoading) return <Loading />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please login to access the dashboard.</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Welcome Header */}
          <div className="mb-8 animate-fadeInUp">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-200">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Welcome back, {user.name}! 👋
                </h1>
                <p className="text-gray-500">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase mr-2">
                    {user.role}
                  </span>
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* ===== CUSTOMER Dashboard ===== */}
          {user.role === 'CUSTOMER' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeInUp animate-delay-100">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                      <IoReceipt className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-blue-900">
                        {orders.length}
                      </p>
                      <p className="text-sm text-blue-700">Total Orders</p>
                    </div>
                  </div>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                      <IoFastFood className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-green-900">
                        {orders.filter((o) => o.status === 'DELIVERED').length}
                      </p>
                      <p className="text-sm text-green-700">Delivered</p>
                    </div>
                  </div>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                      <IoStar className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-orange-900">
                        {orders
                          .filter(
                            (o) =>
                              o.status === 'PLACED' ||
                              o.status === 'PREPARING',
                          )
                          .length}
                      </p>
                      <p className="text-sm text-orange-700">In Progress</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeInUp animate-delay-200">
                <Link
                  href="/meals"
                  className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                      <IoRestaurant className="text-orange-500" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Browse Meals</p>
                      <p className="text-sm text-gray-500">
                        Discover something new
                      </p>
                    </div>
                  </div>
                  <IoArrowForward className="text-gray-400" />
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                      <IoReceipt className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Order History</p>
                      <p className="text-sm text-gray-500">
                        View all your orders
                      </p>
                    </div>
                  </div>
                  <IoArrowForward className="text-gray-400" />
                </Link>
              </div>

              {/* Recent Orders */}
              {orders.length > 0 && (
                <Card className="animate-fadeInUp animate-delay-300">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                      Recent Orders
                    </h2>
                    <Link
                      href="/orders"
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <Link
                        key={order.id}
                        href={`/orders/${order.id}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                      >
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800 text-sm">
                            ৳ {order.totalPrice.toLocaleString()}
                          </p>
                          <span className="text-xs text-orange-600 font-medium">
                            {order.status}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ===== PROVIDER Dashboard ===== */}
          {user.role === 'PROVIDER' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeInUp animate-delay-100">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                      <IoRestaurant className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-green-900">
                        {dataLoading ? '...' : mealCount}
                      </p>
                      <p className="text-sm text-green-700">My Meals</p>
                    </div>
                  </div>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                      <IoGrid className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-purple-900">
                        Active
                      </p>
                      <p className="text-sm text-purple-700">Account Status</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeInUp animate-delay-200">
                <Link
                  href="/provider/meals"
                  className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                      <IoRestaurant className="text-green-500" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Manage Meals</p>
                      <p className="text-sm text-gray-500">
                        Add, edit, or remove meals
                      </p>
                    </div>
                  </div>
                  <IoArrowForward className="text-gray-400" />
                </Link>
                <Link
                  href="/meals"
                  className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                      <IoFastFood className="text-orange-500" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Browse All Meals</p>
                      <p className="text-sm text-gray-500">
                        See all platform meals
                      </p>
                    </div>
                  </div>
                  <IoArrowForward className="text-gray-400" />
                </Link>
              </div>
            </div>
          )}

          {/* ===== ADMIN Dashboard ===== */}
          {user.role === 'ADMIN' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeInUp animate-delay-100">
                <Link
                  href="/admin/users"
                  className="group bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IoPeople className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-red-900">Manage Users</p>
                      <p className="text-sm text-red-700">
                        Ban/unban accounts
                      </p>
                    </div>
                  </div>
                  <IoArrowForward className="text-red-400" />
                </Link>
                <Link
                  href="/admin/orders"
                  className="group bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IoReceipt className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-cyan-900">All Orders</p>
                      <p className="text-sm text-cyan-700">
                        View & update status
                      </p>
                    </div>
                  </div>
                  <IoArrowForward className="text-cyan-400" />
                </Link>
                <Link
                  href="/admin/categories"
                  className="group bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IoGrid className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-pink-900">Categories</p>
                      <p className="text-sm text-pink-700">
                        Create & manage
                      </p>
                    </div>
                  </div>
                  <IoArrowForward className="text-pink-400" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
