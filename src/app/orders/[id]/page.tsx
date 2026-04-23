'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById } from '@/src/lib/api';
import { useAuthContext } from '@/src/context/AuthContext';
import { Card, Button, Loading } from '@/src/components/ui';
import { IoArrowBack, IoReceiptOutline, IoLocationOutline, IoTimeOutline, IoCheckmarkCircle, IoCheckmarkCircleOutline } from 'react-icons/io5';
import Link from 'next/link';
import { getImageUrl } from '@/src/utils/imageUrl';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  meal: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  address: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuthContext();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOrder();
  }, [id, user]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await getOrderById(id);
      setOrder(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED': return 'bg-blue-100 text-blue-700';
      case 'PREPARING': return 'bg-orange-100 text-orange-700';
      case 'READY': return 'bg-purple-100 text-purple-700';
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStepStatus = (step: string) => {
    if (!order) return 'inactive';
    const statusOrder = ['PLACED', 'PREPARING', 'READY', 'DELIVERED'];
    const currentIdx = statusOrder.indexOf(order.status);
    const stepIdx = statusOrder.indexOf(step);

    if (order.status === 'CANCELLED') return 'inactive';
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'pending';
  };

  if (loading) return <div className="p-20 text-center"><Loading /></div>;
  if (error || !order) return (
    <div className="p-20 text-center">
      <p className="text-red-500 font-bold mb-4">{error || 'Something went wrong'}</p>
      <Button onClick={() => router.push('/orders')}>Back to Orders</Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.push('/orders')} className="p-2.5 hover:bg-white rounded-xl transition shadow-sm border border-gray-100">
          <IoArrowBack size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Order Tracking</h1>
          <p className="text-gray-500 text-sm">Order ID: #{order.id.slice(0, 8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Main Tracking & Items */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Tracking Status */}
          <Card className="p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
              <IoTimeOutline className="text-orange-500" /> Track Status
            </h2>
            
            <div className="relative">
              {/* Connector Line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-gray-100" />
              
              <div className="space-y-8 relative">
                {['PLACED', 'PREPARING', 'READY', 'DELIVERED'].map((step) => {
                  const status = getStepStatus(step);
                  return (
                    <div key={step} className="flex items-start gap-4">
                      <div className={`
                        z-10 w-8 h-8 rounded-full flex items-center justify-center 
                        ${status === 'completed' ? 'bg-green-500 text-white' : 
                          status === 'current' ? 'bg-orange-500 text-white animate-pulse' : 
                          'bg-white border-2 border-gray-200 text-gray-300'}
                      `}>
                        {status === 'completed' ? <IoCheckmarkCircle size={20} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${status === 'pending' ? 'text-gray-400' : 'text-gray-800'}`}>
                          {step}
                        </p>
                        <p className="text-xs text-gray-500">
                          {status === 'completed' ? 'Successfully processed' : 
                           status === 'current' ? 'Your order is currently here' : 
                           'Awaiting previous steps'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {order.status === 'CANCELLED' && (
              <div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-100 text-red-600 font-bold text-sm text-center">
                This order has been cancelled.
              </div>
            )}
          </Card>

          {/* Items List */}
          <Card className="p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <IoReceiptOutline className="text-orange-500" /> Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                    {item.meal.image ? (
                       <img 
                          src={getImageUrl(item.meal.image)} 
                          alt={item.meal.name} 
                          className="w-full h-full object-cover" 
                       />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">{item.meal.name}</p>
                    <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Order Info Summary */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-bold text-gray-800 mb-4">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-800">৳{order.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-extrabold text-orange-600">৳{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-6">
               <Link href={`/orders/${order.id}/invoice`}>
                 <Button variant="outline" fullWidth className="text-sm">Download Invoice</Button>
               </Link>
            </div>
          </Card>

          <Card className="p-6">
             <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
               <IoLocationOutline className="text-orange-500" /> Delivery To
             </h2>
             <p className="text-sm text-gray-600 leading-relaxed">
               {order.address}
             </p>
          </Card>
        </div>

      </div>
    </div>
  );
}
