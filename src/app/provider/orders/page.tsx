'use client';

import React, { useEffect, useState } from 'react';
import api from '@/src/lib/api';
import { Loading, Card, Button, Toast } from '@/src/components/ui';
import { IoTimeOutline, IoCheckmarkCircle, IoListOutline } from 'react-icons/io5';
import { getImageUrl } from '@/src/utils/imageUrl';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  meal: { name: string; image: string };
}

interface Order {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  user: { name: string; email: string };
  items: OrderItem[];
}

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/provider');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch provider orders', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setToast({ message: `Order status updated to ${newStatus}`, type: 'success' });
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  if (loading) return <div className="p-20 text-center"><Loading /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10 animate-fadeInUp">
           <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Management</h1>
           <p className="text-gray-500 text-sm">Manage incoming orders and update delivery status.</p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-20 text-center">
             <div className="text-6xl mb-4">📦</div>
             <p className="text-gray-500 font-medium text-lg">No orders found for your meals yet.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 sm:p-8 animate-fadeInUp">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Left: Customer & Items */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
                         {order.status}
                      </span>
                      <span className="text-gray-400 text-sm font-mono">#{order.id.slice(0, 8)}</span>
                      <span className="text-gray-400 text-sm">• {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm font-bold text-gray-400 uppercase mb-2">Customer</p>
                      <p className="font-bold text-gray-900">{order.user.name}</p>
                      <p className="text-sm text-gray-500">{order.user.email}</p>
                    </div>

                    <div className="space-y-3">
                       <p className="text-sm font-bold text-gray-400 uppercase mb-2">Order Items</p>
                       {order.items.map(item => (
                         <div key={item.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                               <img src={getImageUrl(item.meal.image)} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-sm font-medium text-gray-800">
                              {item.quantity}x {item.meal.name}
                            </p>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="w-full md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                     <div className="mb-6">
                        <p className="text-sm font-bold text-gray-400 uppercase mb-1">Total Income</p>
                        <p className="text-2xl font-extrabold text-orange-600">৳{order.totalPrice.toLocaleString()}</p>
                     </div>

                     <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Update Status</p>
                        {order.status === 'PLACED' && (
                          <Button fullWidth size="sm" onClick={() => updateStatus(order.id, 'PREPARING')}>Start Preparing</Button>
                        )}
                        {order.status === 'PREPARING' && (
                          <Button fullWidth size="sm" onClick={() => updateStatus(order.id, 'READY')}>Mark as Ready</Button>
                        )}
                        {order.status === 'READY' && (
                          <Button fullWidth size="sm" onClick={() => updateStatus(order.id, 'DELIVERED')}>Mark Delivered</Button>
                        )}
                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <Button fullWidth size="sm" variant="outline" className="text-red-600 border-red-100 hover:bg-red-50" onClick={() => updateStatus(order.id, 'CANCELLED')}>Cancel Order</Button>
                        )}
                        {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
                          <div className="text-center p-3 bg-gray-50 rounded-xl text-gray-400 text-xs font-bold flex items-center justify-center gap-2">
                             <IoCheckmarkCircle className="text-green-500" /> Finished
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
