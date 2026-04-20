'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/src/services/api';

interface Category {
  id: string;
  name: string;
}

// Emoji mapping for common food categories
const categoryEmojis: Record<string, string> = {
  pizza: '🍕',
  burger: '🍔',
  drinks: '🥤',
  dessert: '🍰',
  biryani: '🍛',
  sushi: '🍣',
  salad: '🥗',
  pasta: '🍝',
  chicken: '🍗',
  bbq: '🥩',
  sandwich: '🥪',
  coffee: '☕',
  noodles: '🍜',
  seafood: '🦐',
  steak: '🥩',
  icecream: '🍦',
  soup: '🍲',
  default: '🍽️',
};

const categoryColors = [
  'from-orange-100 to-orange-50 hover:from-orange-200 hover:to-orange-100 border-orange-200',
  'from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 border-blue-200',
  'from-green-100 to-green-50 hover:from-green-200 hover:to-green-100 border-green-200',
  'from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 border-purple-200',
  'from-pink-100 to-pink-50 hover:from-pink-200 hover:to-pink-100 border-pink-200',
  'from-yellow-100 to-yellow-50 hover:from-yellow-200 hover:to-yellow-100 border-yellow-200',
  'from-red-100 to-red-50 hover:from-red-200 hover:to-red-100 border-red-200',
  'from-teal-100 to-teal-50 hover:from-teal-200 hover:to-teal-100 border-teal-200',
];

/**
 * Categories Section — Fetches categories dynamically from the API
 * and displays them as animated, colorful cards with emoji icons.
 */
export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getEmoji = (name: string) => {
    const key = name.toLowerCase().trim();
    return categoryEmojis[key] || categoryEmojis.default;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Browse by Category
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Find exactly what you&apos;re craving from our wide selection
          </p>
        </div>

        {/* Category Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                href={`/meals?category=${cat.id}`}
                className={`
                  group relative flex flex-col items-center justify-center p-6 rounded-2xl
                  bg-gradient-to-br border transition-all duration-300
                  hover:shadow-lg hover:-translate-y-1 cursor-pointer
                  animate-fadeInUp
                  ${categoryColors[index % categoryColors.length]}
                `}
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
              >
                <span className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                  {getEmoji(cat.name)}
                </span>
                <span className="font-semibold text-gray-800 text-sm">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            No categories available yet.
          </p>
        )}
      </div>
    </section>
  );
}

//
//
//
