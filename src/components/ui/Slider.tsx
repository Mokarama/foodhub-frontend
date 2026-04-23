'use client';

import React, { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { getImageUrl } from '@/src/utils/imageUrl';

// Define the interface for slider images
export interface SlideImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

interface SliderProps {
  images: SlideImage[];
  autoSlideInterval?: number; // In milliseconds
}

export default function Slider({ images, autoSlideInterval = 5000 }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    if (images.length === 0) return;
    const slideTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, autoSlideInterval);

    return () => clearInterval(slideTimer);
  }, [images.length, autoSlideInterval]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };



  if (images.length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-3xl animate-pulse">
        <span className="text-gray-400">Loading delicious images...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden group shadow-2xl shadow-orange-200">
      {/* Images container */}
      <div className="w-full h-full relative">
        {images.map((img, index) => (
          <div
            key={img.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={getImageUrl(img.url)}
              alt={img.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Meta overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Title & Description */}
            {(img.title || img.description) && (
              <div className="absolute bottom-10 left-8 right-8 text-white animate-fadeInUp">
                {img.title && <h3 className="text-3xl font-extrabold mb-2">{img.title}</h3>}
                {img.description && <p className="text-base text-gray-200">{img.description}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          aria-label="Previous slide"
        >
          <IoChevronBack size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          aria-label="Next slide"
        >
          <IoChevronForward size={24} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-orange-500 w-8' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
