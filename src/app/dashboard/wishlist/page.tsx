'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getWishlist, toggleWishlist } from '@/src/services/api';
import { useAuthContext } from '@/src/context/AuthContext';
import { useCart } from '@/src/context/CartContext';
import { Loading, Button } from '@/src/components/ui';
import { IoHeartDislike, IoCart } from 'react-icons/io5';
import { getImageUrl } from '@/src/utils/imageUrl';

interface WishlistItem {
  id: string;
  meal: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: { name: string };
    provider: { id: string, name: string };
  }
}

export default function WishlistPage() {
  const { user } = useAuthContext();
  const { addToCart } = useCart();
  const router = useRouter();

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'CUSTOMER') {
      fetchWishlist();
    } else if (user) {
      router.push('/dashboard');
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await getWishlist();
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (mealId: string) => {
    try {
      await toggleWishlist(mealId);
      setWishlist(wishlist.filter(w => w.meal.id !== mealId));
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  const handleAddToCart = (meal: any) => {
    addToCart({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: 1,
      image: meal.image || '',
      providerId: meal.provider.id,
    });
    alert(`${meal.name} added to cart!`);
  };



  if (loading) return <div className="p-20 text-center"><Loading /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeInUp">
      <div className="mb-8 border-b border-gray-100 pb-6 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-gray-900">My Favorites</h1>
        <p className="text-gray-500 mt-2">Meals you love and want to order later ❤️</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Explore meals and click the heart icon to save them here.</p>
          <Link href="/meals">
            <Button variant="primary">Browse Meals</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <Link href={`/meals/${item.meal.id}`} className="block relative h-48 overflow-hidden">
                <img 
                  src={getImageUrl(item.meal.image)} 
                  alt={item.meal.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-orange-600">
                  {item.meal.category.name}
                </div>
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/meals/${item.meal.id}`}>
                    <h3 className="font-bold text-lg text-gray-900 hover:text-orange-500 transition-colors line-clamp-1">{item.meal.name}</h3>
                  </Link>
                  <span className="font-extrabold text-gray-900">৳{item.meal.price.toFixed(0)}</span>
                </div>
                <p className="text-xs text-gray-400 mb-4 truncate">By {item.meal.provider.name}</p>
                
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => handleAddToCart(item.meal)} 
                    variant="primary" 
                    className="flex-1 text-sm py-2"
                  >
                    <IoCart size={16} className="mr-1" /> Add to Cart
                  </Button>
                  <button 
                    onClick={() => handleRemove(item.meal.id)}
                    className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                    title="Remove from favorites"
                  >
                    <IoHeartDislike size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
