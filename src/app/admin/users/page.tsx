'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/src/context/AuthContext';
import { adminGetUsers, adminUpdateUserStatus } from '@/src/services/api';
import { Card, Loading, Toast, Button } from '@/src/components/ui';
import { User } from '@/src/types';
import {
  IoPeople,
  IoReceipt,
  IoGrid,
  IoShieldCheckmark,
  IoBan,
  IoCheckmarkCircle,
} from 'react-icons/io5';

/**
 * Admin Users Management
 * - Lists all users (name, email, role, status)
 * - Ban/Unban toggle
 * - Role filter tabs
 */
export default function AdminUsersPage() {
  const { user, isLoading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
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

    const fetchUsers = async () => {
      try {
        const res = await adminGetUsers();
        setUsers(res.data);
      } catch (err: any) {
        setToast({
          message: err.response?.data?.message || 'Failed to load users',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [isLoading, isAuthenticated, user, router]);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    try {
      await adminUpdateUserStatus(userId, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
      );
      setToast({
        message: `User ${newStatus === 'BANNED' ? 'banned' : 'unbanned'} successfully`,
        type: 'success',
      });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || 'Failed to update user',
        type: 'error',
      });
    }
  };

  const filteredUsers =
    filter === 'ALL' ? users : users.filter((u) => u.role === filter);

  if (isLoading || loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Admin Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fadeInDown">
          {[
            { href: '/admin/users', label: 'Users', icon: IoPeople, active: true },
            { href: '/admin/orders', label: 'Orders', icon: IoReceipt, active: false },
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
              User Management
            </h1>
            <p className="text-gray-500 text-sm">
              {users.length} total users
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {['ALL', 'CUSTOMER', 'PROVIDER', 'ADMIN'].map((role) => (
              <button
                key={role}
                onClick={() => setFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filter === role
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <Card className="overflow-hidden animate-fadeInUp animate-delay-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    User
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Role
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {u.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : u.role === 'PROVIDER'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? (
                          <IoCheckmarkCircle size={12} />
                        ) : (
                          <IoBan size={12} />
                        )}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            u.status === 'ACTIVE'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Ban' : 'Unban'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No users found.
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
