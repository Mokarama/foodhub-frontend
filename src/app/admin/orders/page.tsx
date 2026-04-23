'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/src/context/AuthContext';
import { adminGetAllOrders, updateOrderStatus } from '@/src/services/api';
import { Card, Loading, Toast } from '@/src/components/ui';
import { Order } from '@/src/types';
import { IoPeople, IoReceipt, IoGrid } from 'react-icons/io5';

const statusOptions = ['PLACED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

const statusColors: Record<string, { bg: string; text: string }> = {
  PLACED: { bg: 'bg-blue-100', text: 'text-blue-700' },
  PREPARING: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  READY: { bg: 'bg-green-100', text: 'text-green-700' },
  DELIVERED: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-700' },
};

/**
 * Admin Orders Management
 * - Lists all system orders
 * - Update order status with dropdown
 * - Filter by status
 */
export default function AdminOrdersPage() {
  const { user, isLoading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/dashboard');
      return;
    }
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const res = await adminGetAllOrders();
        setOrders(res.data);
      } catch (err: any) {
        setToast({
          message: err.response?.data?.message || 'Failed to load orders',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isLoading, isAuthenticated, user, router]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus as any } : o,
        ),
      );
      setToast({
        message: `Order status updated to ${newStatus}`,
        type: 'success',
      });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || 'Failed to update status',
        type: 'error',
      });
    }
  };

  const filteredOrders =
    filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  if (isLoading || loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Admin Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fadeInDown">
          {[
            { href: '/admin/users', label: 'Users', icon: IoPeople, active: false },
            { href: '/admin/orders', label: 'Orders', icon: IoReceipt, active: true },
            { href: '/admin/categories', label: 'Categories', icon: IoGrid, active: false },
          ].map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                tab.active
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fadeInUp">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Order Management
            </h1>
            <p className="text-gray-500 text-sm">
              {orders.length} total orders
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 overflow-x-auto">
            {['ALL', ...statusOptions].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  filter === s
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <Card className="overflow-hidden animate-fadeInUp animate-delay-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Order
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Items
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Total
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const sc = statusColors[order.status] || statusColors.PLACED;
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800 text-sm">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">
                          {order.user?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(order.user as any)?.email || ''}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-600">
                          {order.items.length} item
                          {order.items.length !== 1 ? 's' : ''}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-800 text-sm">
                          ৳ {order.totalPrice.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer ${sc.bg} ${sc.text}`}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No orders found.
            </div>
          )}
        </Card>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
