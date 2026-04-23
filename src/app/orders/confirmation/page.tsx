'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, Loading } from '@/src/components/ui';
import { getOrderById } from '@/src/services/api';
import { IoCheckmarkCircle, IoArrowForward } from 'react-icons/io5';

interface OrderDetails {
  id: string;
  status: string;
  totalPrice: number;
  address: string;
  createdAt: string;
  items: Array<{
    id: string;
    meal: { name: string; price: number };
    quantity: number;
    price: number;
  }>;
}

/**
 * Order Confirmation Page
 * Displays after a successful order placement.
 * Gets orderId from search params (?id=xxx) or shows generic success.
 */
function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(!!orderId);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-200 animate-scaleIn">
              <IoCheckmarkCircle className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-500 text-lg">
            Thank you for your order. Your food will be delivered soon.
          </p>
        </div>

        {/* Order Details (if available) */}
        {order && (
          <Card className="mb-6 animate-fadeInUp animate-delay-200">
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <p className="text-gray-500 text-sm">Order ID</p>
                <p className="text-lg font-bold text-gray-800">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p className="text-lg font-bold text-orange-600">
                  {order.status}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Date</p>
                <p className="font-semibold text-gray-800">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-lg font-bold text-gray-800">
                  ৳ {order.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                Items Ordered
              </h2>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {item.meal.name}
                      </p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">
                      ৳{' '}
                      {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                Delivery Address
              </h2>
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-gray-700 text-sm">{order.address}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 animate-fadeInUp animate-delay-300">
          {orderId && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push(`/orders/${orderId}`)}
              className="!rounded-xl"
            >
              Track Order
            </Button>
          )}
          <Button
            size="lg"
            onClick={() => router.push('/meals')}
            className={`!rounded-xl flex items-center justify-center gap-2 ${!orderId ? 'col-span-2' : ''}`}
          >
            Continue Shopping
            <IoArrowForward />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ConfirmationContent />
    </Suspense>
  );
}
