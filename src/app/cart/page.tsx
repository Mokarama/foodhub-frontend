'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';
import { Card, Button } from '@/src/components/ui';
import { IoTrash, IoAdd, IoRemove, IoArrowBack, IoArrowForward } from 'react-icons/io5';
import Link from 'next/link';
import { getImageUrl } from '@/src/utils/imageUrl';

export default function CartPage() {
  const router = useRouter();
  const { items, getTotalPrice, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-12">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet. Discover something delicious!</p>
          <Button fullWidth onClick={() => router.push('/meals')} size="lg">
            Browse Meals
          </Button>
        </Card>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const deliveryFee = 50;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2.5 hover:bg-white rounded-xl transition shadow-sm border border-gray-200">
                <IoArrowBack size={20} className="text-gray-600" />
              </button>
              <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
           </div>
           <p className="text-gray-500 font-medium">{items.length} items selected</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-4 sm:p-6 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img 
                       src={getImageUrl(item.image)} 
                       alt={item.name} 
                       className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 text-lg truncate">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <IoTrash size={18} />
                      </button>
                    </div>
                    <p className="text-orange-600 font-bold mb-4">৳{item.price.toLocaleString()}</p>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition"
                        >
                          <IoRemove size={14} />
                        </button>
                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition"
                        >
                          <IoAdd size={14} />
                        </button>
                      </div>
                      <div className="ml-auto font-extrabold text-gray-900">
                         ৳{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="p-8 bg-white sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-500">
                   <span>Subtotal</span>
                   <span className="font-semibold text-gray-800">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                   <span>Delivery Fee</span>
                   <span className="font-semibold text-gray-800">৳{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                   <span>Tax (10%)</span>
                   <span className="font-semibold text-gray-800">৳{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                 <span className="text-lg font-bold text-gray-900">Total</span>
                 <span className="text-3xl font-extrabold text-orange-600">৳{total.toLocaleString()}</span>
              </div>

              <Link href="/checkout">
                <Button fullWidth size="lg" className="h-14 text-lg shadow-xl shadow-orange-100">
                   Proceed to Checkout <IoArrowForward className="ml-2" />
                </Button>
              </Link>
              
              <p className="text-center text-xs text-gray-400 mt-6">
                Delivery time: 25-40 mins
              </p>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
