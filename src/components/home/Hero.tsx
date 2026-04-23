'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Slider } from '@/src/components/ui';
import { getFoodImages } from '@/src/lib/api';
import { SlideImage } from '@/src/components/ui/Slider';

import { useLanguage } from '@/src/context/LanguageContext';

export default function Hero() {
  const [images, setImages] = useState<SlideImage[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await getFoodImages();
        setImages(res.data);
      } catch (err) {
        console.error('Failed to fetch hero food images:', err);
      }
    };
    fetchImages();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 transition-colors">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">
          🍔
        </div>
        <div className="absolute bottom-10 right-10 text-5xl opacity-10 animate-float animate-delay-300">
          🍱
        </div>
        {/* Gradient blob */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl opacity-60 dark:opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 text-sm font-semibold mb-6 animate-fadeInDown">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Fresh & Fast Delivery
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fadeInUp">
              <span className="text-gray-900 dark:text-white">{t('hero.title1')}</span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                {t('hero.title2')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed animate-fadeInUp animate-delay-200">
              Discover amazing food from local providers. Order your favorite
              meals and get them delivered to your doorstep in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fadeInUp animate-delay-300">
              <Link
                href="/meals"
                className="px-8 py-4 w-full sm:w-auto text-center rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg shadow-lg shadow-orange-200 dark:shadow-none hover:shadow-xl hover:shadow-orange-300 transition-all duration-300 hover:-translate-y-1 animate-pulse-glow"
              >
                {t('hero.explore')}
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 w-full sm:w-auto text-center rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-300"
              >
                Join as Provider
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 animate-fadeInUp animate-delay-500">
              {[
                { value: '500+', label: 'Meals' },
                { value: '50+', label: 'Providers' },
                { value: '10K+', label: 'Deliveries' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Sliding Image Carousel */}
          <div className="w-full relative px-4 sm:px-8 lg:px-0 animate-fadeInRight animate-delay-300 z-10">
             <Slider 
                images={images} 
                autoSlideInterval={4000} 
             />
             
             {/* Decorative blob under the slider */}
             <div className="absolute inset-0 bg-yellow-300/20 w-3/4 h-3/4 rounded-full blur-3xl -z-10 translate-x-12 translate-y-12" />
          </div>

        </div>
      </div>
    </section>
  );
}