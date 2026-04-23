'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Meal } from '@/src/types';
import api from '@/src/lib/api';
import { IoStar, IoSearch } from 'react-icons/io5';
import { getImageUrl } from '@/src/utils/imageUrl';

function MealsList() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const params: any = {};
        if (categoryFilter) params.categoryId = categoryFilter;
        const res = await api.get('/meals', { params });
        setMeals(res.data);
      } catch (err) {
        setError('Failed to load meals');
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [categoryFilter]);

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 animate-fadeInUp">
            All Meals
          </h1>
          <p className="text-gray-500 text-lg animate-fadeInUp animate-delay-100">
            Discover delicious meals from our amazing providers
          </p>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-lg animate-fadeInUp animate-delay-200">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-semibold border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="skeleton h-48 w-full" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredMeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map((meal, index) => (
              <Link
                key={meal.id}
                href={`/meals/${meal.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1 animate-fadeInUp"
                style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(meal.image)}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Category Badge */}
                  {meal.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 shadow-sm">
                      {meal.category.name}
                    </span>
                  )}
                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm shadow-lg">
                    ৳{meal.price.toFixed(0)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-600 transition-colors">
                    {meal.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {meal.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      by {meal.provider?.name || 'Unknown Provider'}
                    </span>
                    {/* Rating */}
                    {meal.reviews && meal.reviews.length > 0 ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-lg">
                        <IoStar className="text-yellow-500" size={14} />
                        <span className="text-sm font-semibold text-gray-800">
                          {(
                            meal.reviews.reduce((sum, r) => sum + r.rating, 0) /
                            meal.reviews.length
                          ).toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">New</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? `No meals match "${searchQuery}"`
                : 'No meals available yet. Check back soon!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MealsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MealsList />
    </Suspense>
  );
}