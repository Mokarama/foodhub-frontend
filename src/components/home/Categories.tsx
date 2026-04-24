'use client';

import React from 'react';
import Link from 'next/link';
import { IoFastFoodOutline, IoStorefrontOutline, IoIceCreamOutline } from 'react-icons/io5';

/**
 * Categories Section — Minimal and Modern UI
 * Features a clean grid of category cards with soft neutral tones.
 */
const categories = [
  {
    id: 'fast-food',
    name: 'Fast Food',
    icon: <IoFastFoodOutline className="w-8 h-8 text-orange-600" />,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-100',
  },
  {
    id: 'shop',
    name: 'Shop',
    icon: <IoStorefrontOutline className="w-8 h-8 text-blue-600" />,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  {
    id: 'dessert',
    name: 'Dessert',
    icon: <IoIceCreamOutline className="w-8 h-8 text-pink-600" />,
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-100',
  },
];

export default function Categories() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Browse by Category
          </h2>
          <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto">
            Find exactly what you&apos;re craving from our wide selection
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/meals?category=${category.id}`}
              className={`
                group flex flex-col items-center justify-center p-10 
                rounded-[2rem] border-2 ${category.borderColor} ${category.bgColor}
                transition-all duration-500 ease-out
                hover:scale-[1.03] hover:shadow-2xl hover:shadow-gray-200/50
                cursor-pointer relative overflow-hidden
                animate-fadeInUp
              `}
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
            >
              {/* Icon Container */}
              <div className="mb-6 p-5 bg-white rounded-2xl shadow-sm group-hover:rotate-6 transition-transform duration-300">
                {category.icon}
              </div>

              {/* Label */}
              <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                {category.name}
              </h3>
              
              {/* Subtle decorative element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}



