'use client';

import React, { useEffect, useState } from 'react';
import api from '@/src/lib/api';
import { Loading, Card, Button } from '@/src/components/ui';
import { IoRestaurantOutline, IoLocationOutline, IoArrowForward } from 'react-icons/io5';
import Link from 'next/link';

interface Provider {
  id: string;
  name: string;
  email: string;
  providerProfile: {
    bio: string;
    address: string;
  } | null;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get('/providers');
        setProviders(res.data);
      } catch (err) {
        console.error('Failed to fetch providers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  if (loading) return <div className="p-20 text-center"><Loading /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeInDown">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Our Food <span className="text-orange-600">Providers</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Discover the best kitchens and restaurants in your area. Fresh ingredients, 
            expert chefs, and delicious meals delivered to you.
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
             <p className="text-6xl mb-4">🍳</p>
             <p className="text-gray-500 text-xl font-medium">No providers found yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map((provider, index) => (
              <Link key={provider.id} href={`/providers/${provider.id}`} className="group">
                <Card className="p-8 h-full flex flex-col hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-none bg-white relative overflow-hidden">
                  {/* Decorative Background Icon */}
                  <div className="absolute -right-4 -bottom-4 text-gray-50 text-9xl transition-transform group-hover:scale-110 duration-500">
                    <IoRestaurantOutline />
                  </div>
                  
                  <div className="relative z-10 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl mb-6 shadow-sm">
                      👨‍🍳
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {provider.name}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                      <IoLocationOutline className="text-orange-500" />
                      {provider.providerProfile?.address || 'Multiple Locations'}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-3 italic mb-6">
                      "{provider.providerProfile?.bio || 'One of our premium food providers serving high quality meals.'}"
                    </p>
                  </div>

                  <div className="relative z-10 pt-4 flex items-center justify-between border-t border-gray-50">
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">View Menu</span>
                    <div className="p-2 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                       <IoArrowForward size={18} />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
