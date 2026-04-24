'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/src/lib/api';
import { Loading, Card, Button } from '@/src/components/ui';
import { IoStar, IoLocationOutline, IoCallOutline, IoArrowBack } from 'react-icons/io5';
import { getImageUrl } from '@/src/utils/imageUrl';
import Link from 'next/link';

interface Meal {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: { name: string };
  reviews: any[];
}

interface Provider {
  id: string;
  name: string;
  email: string;
  providerProfile: {
    bio: string;
    address: string;
    phone: string;
  };
  meals: Meal[];
}

export default function ProviderDetailsPage() {
  const { id } = useParams() as { id: string };
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/providers/${id}`);
        setProvider(res.data);
      } catch (err: any) {
        setError('Provider not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  if (loading) return <div className="p-20 text-center"><Loading /></div>;
  if (error || !provider) return (
    <div className="p-20 text-center">
      <p className="text-red-500 font-bold mb-4">{error}</p>
      <Button onClick={() => router.push('/')}>Back to Home</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header / Cover */}
      <div className="h-64 bg-gradient-to-r from-orange-500 to-red-600 relative">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
           <button 
             onClick={() => router.back()}
             className="absolute top-8 left-8 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition"
           >
             <IoArrowBack size={24} />
           </button>
           <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-3xl bg-white shadow-xl flex items-center justify-center text-5xl">
                🍳
              </div>
              <div className="text-white pb-2">
                <h1 className="text-4xl font-extrabold mb-2">{provider.name}</h1>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span className="flex items-center gap-1"><IoLocationOutline /> {provider.providerProfile?.address || 'Location N/A'}</span>
                  <span className="flex items-center gap-1"><IoCallOutline /> {provider.providerProfile?.phone || 'Phone N/A'}</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: About & Info */}
        <div className="space-y-8">
           <Card className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Provider</h2>
              <p className="text-gray-600 leading-relaxed italic">
                "{provider.providerProfile?.bio || 'No bio available for this provider.'}"
              </p>
           </Card>

           <Card className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Store Info</h2>
              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Contact Email</span>
                   <span className="font-semibold text-gray-800">{provider.email}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Member Since</span>
                   <span className="font-semibold text-gray-800">2026</span>
                 </div>
              </div>
           </Card>
        </div>

        {/* Right: Menu */}
        <div className="lg:col-span-2">
           <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Our Menu</h2>
           {provider.meals.length === 0 ? (
             <Card className="p-20 text-center">
                <p className="text-5xl mb-4">🍽️</p>
                <p className="text-gray-500">This provider hasn't added any meals yet.</p>
             </Card>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {provider.meals.map(meal => (
                  <Link key={meal.id} href={`/meals/${meal.id}`} className="group">
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src={getImageUrl(meal.image)} 
                          alt={meal.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-700">
                          {meal.category.name}
                        </span>
                      </div>
                      <div className="p-5">
                         <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{meal.name}</h3>
                            <span className="font-extrabold text-orange-600">৳{meal.price}</span>
                         </div>
                         <p className="text-sm text-gray-500 line-clamp-2 mb-4">{meal.description}</p>
                         <div className="flex items-center gap-1 text-yellow-500">
                            <IoStar size={14} />
                            <span className="text-xs font-bold text-gray-700">
                               {meal.reviews.length > 0 ? (meal.reviews.reduce((s, r) => s + r.rating, 0) / meal.reviews.length).toFixed(1) : 'No reviews'}
                            </span>
                         </div>
                      </div>
                    </Card>
                  </Link>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
