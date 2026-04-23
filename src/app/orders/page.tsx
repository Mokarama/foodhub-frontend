'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/src/context/AuthContext';
import { getUserOrders } from '@/src/lib/api';
import { Loading, Card, Toast } from '@/src/components/ui';
import { Order, OrderStatus } from '@/src/types';
import { IoReceipt, IoArrowForward } from 'react-icons/io5';

/**
 * Customer Orders Page — Shows order history with status badges
 */

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PLACED: {
    label: 'Placed',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
  },
  PREPARING: {
    label: 'Preparing',
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
  },
  READY: {
    label: 'Ready',
    color: 'text-green-700',
    bg: 'bg-green-100',
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-700',
    bg: 'bg-red-100',
  },
};

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const res = await getUserOrders();
        setOrders(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
            My Orders
          </h1>
          <p className="text-gray-500">Track and manage your order history</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <Card className="text-center py-16 animate-fadeInUp">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start ordering delicious meals!
            </p>
            <Link
              href="/meals"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg transition"
            >
              Browse Meals
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = statusConfig[order.status] || statusConfig.PLACED;
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-0.5 animate-fadeInUp"
                  style={{
                    animationDelay: `${index * 80}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                          <IoReceipt className="text-orange-500" size={22} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              },
                            )}{' '}
                            • {order.items.length} item
                            {order.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}
                        >
                          {status.label}
                        </span>
                        <span className="font-bold text-gray-800">
                          ৳ {order.totalPrice.toLocaleString()}
                        </span>
                        <IoArrowForward className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
