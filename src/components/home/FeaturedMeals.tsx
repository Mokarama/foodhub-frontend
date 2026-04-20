'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Meal } from '@/src/types';
import api from '@/src/services/api';
import { IoStar, IoArrowForward } from 'react-icons/io5';

/**
 * FeaturedMeals — Fetches the first 6 meals from the API
 * and displays them in premium cards with image, rating, price, and provider.
 */
export default function FeaturedMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await api.get('/meals');
        // Take first 6 meals
        setMeals(res.data.slice(0, 6));
      } catch (error) {
        console.error('Failed to load meals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
          <div className="text-center sm:text-left mb-4 sm:mb-0 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Featured Meals
            </h2>
            <p className="text-gray-500 text-lg">
              Top picks from our best providers
            </p>
          </div>
          <Link
            href="/meals"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:border-orange-300 hover:text-orange-600 transition-all duration-300 shadow-sm hover:shadow-md animate-fadeInUp"
          >
            View All
            <IoArrowForward />
          </Link>
        </div>

        {/* Meals Grid */}
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
        ) : meals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal, index) => (
              <Link
                key={meal.id}
                href={`/meals/${meal.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
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
                  <p className="text-sm text-gray-500 mb-3">
                    by {meal.provider?.name || 'Unknown Provider'}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    {meal.reviews && meal.reviews.length > 0 ? (
                      <>
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-lg">
                          <IoStar className="text-yellow-500" size={14} />
                          <span className="text-sm font-semibold text-gray-800">
                            {(
                              meal.reviews.reduce(
                                (sum, r) => sum + r.rating,
                                0,
                              ) / meal.reviews.length
                            ).toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          ({meal.reviews.length} reviews)
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No reviews yet
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-gray-500 text-lg">
              No meals available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}