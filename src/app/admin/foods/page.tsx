'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMeals, deleteMeal } from '@/src/services/api';
import { useAuthContext } from '@/src/context/AuthContext';
import { Button, Loading, Toast } from '@/src/components/ui';
import { IoTrash, IoSearch } from 'react-icons/io5';

interface Meal {
  id: string;
  name: string;
  price: number;
  category: { id: string; name: string };
  provider: { id: string; name: string };
}

export default function AdminFoodsPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
    } else {
      fetchMeals();
    }
  }, [user]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await getMeals();
      setMeals(res.data);
    } catch (err) {
      console.error('Failed to fetch meals', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to completely delete this meal?')) return;
    try {
      await deleteMeal(id);
      setMeals(meals.filter(m => m.id !== id));
      alert('Meal deleted successfully');
    } catch (err) {
      console.error('Delete error', err);
      alert('Failed to delete meal');
    }
  };

  const filteredMeals = meals.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.provider.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center"><Loading /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fadeInUp">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Master Food List</h1>
          <p className="text-gray-500 mt-1">Manage all food items across the platform</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
             type="text" 
             placeholder="Search name or provider..."
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="px-6 py-4 font-semibold">Meal Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Provider</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMeals.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No meals found</td>
              </tr>
            ) : (
              filteredMeals.map((meal) => (
                <tr key={meal.id} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{meal.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold">
                      {meal.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">{meal.provider.name}</td>
                  <td className="px-6 py-4 font-bold text-orange-600">Rs. {meal.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(meal.id)}
                      className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Meal"
                    >
                      <IoTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
