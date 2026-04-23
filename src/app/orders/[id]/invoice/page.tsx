'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById } from '@/src/lib/api';
import { useAuthContext } from '@/src/context/AuthContext';
import { Loading } from '@/src/components/ui';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  meal: { name: string; price: number };
}

interface Order {
  id: string;
  status: string;
  address: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}

export default function InvoicePage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuthContext();
  const router = useRouter();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOrder();
  }, [user, id]);

  const fetchOrder = async () => {
    try {
      const res = await getOrderById(id);
      setOrder(res.data);
      // Wait for render, then trigger print
      setTimeout(() => {
        window.print();
      }, 800);
    } catch (err) {
      console.error("Failed to load invoice", err);
      alert('Internal error loading invoice');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !order) return <div className="p-20 text-center"><Loading /></div>;

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Print-specific styles to hide navbar and footer */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          nav, footer, button { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .invoice-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; border: none !important; }
        }
      `}} />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="invoice-container bg-white max-w-3xl w-full p-10 rounded-2xl shadow-xl border border-gray-200 text-gray-900">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-orange-600 mb-2">FoodHub</h1>
              <p className="text-gray-500">123 Delivery Street, Tech City</p>
              <p className="text-gray-500">support@foodhub.com</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold uppercase text-gray-800 tracking-wider mb-2">Invoice</h2>
              <p className="font-mono text-gray-600 text-sm">#{order.id}</p>
              <p className="text-gray-500 mt-2">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Billed To</h3>
              <p className="font-bold text-gray-800">{user?.name}</p>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Delivery Address</h3>
              <p className="text-gray-600 w-2/3">{order.address}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mb-12 border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-left">
                <th className="py-3 font-bold text-gray-600">Item</th>
                <th className="py-3 font-bold text-gray-600 text-center">Qty</th>
                <th className="py-3 font-bold text-gray-600 text-right">Price</th>
                <th className="py-3 font-bold text-gray-600 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="py-4 font-semibold text-gray-800">{item.meal.name}</td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right">৳ {item.price.toLocaleString()}</td>
                  <td className="py-4 text-right font-bold text-gray-900">
                    ৳ {(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-1/2">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">৳ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-4 mt-2">
                <span className="text-xl font-bold text-gray-900">Grand Total</span>
                <span className="text-2xl font-extrabold text-orange-600">৳ {order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center border-t border-gray-100 pt-8 text-gray-400 text-sm">
            Thank you for ordering with FoodHub. Bon Appetit!
          </div>
          
          <button 
             onClick={() => router.back()} 
             className="block mx-auto mt-8 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition"
          >
             Go Back
          </button>
        </div>
      </div>
    </>
  );
}
