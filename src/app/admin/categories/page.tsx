'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/src/context/AuthContext';
import {
  adminGetCategories,
  adminCreateCategory,
  adminDeleteCategory,
} from '@/src/lib/api';
import { Card, Loading, Toast, Button, Input } from '@/src/components/ui';
import { Category } from '@/src/types';
import { IoPeople, IoReceipt, IoGrid, IoTrash, IoAdd } from 'react-icons/io5';

/**
 * Admin Categories Management
 * - List all categories
 * - Create new category
 * - Delete category
 */
export default function AdminCategoriesPage() {
  const { user, isLoading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
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

    const fetchCategories = async () => {
      try {
        const res = await adminGetCategories();
        setCategories(res.data);
      } catch (err: any) {
        setToast({
          message:
            err.response?.data?.message || 'Failed to load categories',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [isLoading, isAuthenticated, user, router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setToast({ message: 'Category name is required', type: 'error' });
      return;
    }

    setCreating(true);
    try {
      const res = await adminCreateCategory(newName.trim());
      setCategories((prev) => [...prev, res.data]);
      setNewName('');
      setToast({ message: 'Category created!', type: 'success' });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || 'Failed to create category',
        type: 'error',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;

    try {
      await adminDeleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setToast({ message: 'Category deleted', type: 'success' });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || 'Failed to delete category',
        type: 'error',
      });
    }
  };

  if (isLoading || loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Admin Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fadeInDown">
          {[
            { href: '/admin/users', label: 'Users', icon: IoPeople, active: false },
            { href: '/admin/orders', label: 'Orders', icon: IoReceipt, active: false },
            { href: '/admin/categories', label: 'Categories', icon: IoGrid, active: true },
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
        <div className="mb-6 animate-fadeInUp">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Category Management
          </h1>
          <p className="text-gray-500 text-sm">
            {categories.length} categories
          </p>
        </div>

        {/* Create Form */}
        <Card className="mb-6 animate-fadeInUp animate-delay-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Create New Category
          </h2>
          <form onSubmit={handleCreate} className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Biryani, Sushi, BBQ..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <Button
              type="submit"
              loading={creating}
              className="flex items-center gap-2 !rounded-xl"
            >
              <IoAdd size={18} />
              Create
            </Button>
          </form>
        </Card>

        {/* Categories List */}
        <Card className="animate-fadeInUp animate-delay-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            All Categories
          </h2>
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-3">📂</p>
              <p>No categories yet. Create one above!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-lg">
                      🍽️
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{cat.name}</p>
                      <p className="text-xs text-gray-400 font-mono">
                        {cat.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                  >
                    <IoTrash size={18} />
                  </button>
                </div>
              ))}
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
