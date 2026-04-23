'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';
import { useAuthContext } from '@/src/context/AuthContext';
import { Button, Card, Loading, Toast } from '@/src/components/ui';
import api, { createOrder } from '@/src/lib/api';
import { validateAddress } from '@/src/utils/validation';
import { IoArrowBack, IoTrash, IoAdd, IoRemove } from 'react-icons/io5';

/**
 * Checkout Page
 * - Shows cart items with quantity controls
 * - Delivery address form (matches backend `address` field)
 * - Price breakdown with delivery fee + tax
 * - Places order via POST /api/orders
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthContext();
  const { items, getTotalPrice, clearCart, updateQuantity, removeFromCart } =
    useCart();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Redirect if not authenticated or empty cart
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate address
    if (!address || !validateAddress(address)) {
      setAddressError('Delivery address must be at least 5 characters');
      return;
    }
    setAddressError('');

    setLoading(true);
    try {
      // Build order payload matching backend: { items, address, couponCode }
      const orderData = {
        items: items.map((item) => ({
          mealId: item.id,
          quantity: item.quantity,
        })),
        address,
        couponCode: discountValue > 0 ? couponCode : undefined,
      };

      const response = await createOrder(orderData);

      setToast({ message: 'Order placed successfully!', type: 'success' });

      // Clear cart and redirect to order tracking
      clearCart();
      setTimeout(() => {
        router.push(`/orders/${response.data.id}`);
      }, 1000);
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || 'Failed to place order',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return <Loading />;

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Add some delicious meals to get started!
          </p>
          <Button fullWidth onClick={() => router.push('/meals')}>
            Browse Meals
          </Button>
        </Card>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setValidatingCoupon(true);
    setCouponError('');
    setCouponSuccess('');
    
    try {
      const res = await api.post('/coupons/validate', { code: couponCode });
      const { discountType, value } = res.data;
      
      let amount = 0;
      if (discountType === 'PERCENTAGE') {
        amount = (getTotalPrice() * value) / 100;
      } else {
        amount = value;
      }
      
      setDiscountValue(amount);
      setCouponSuccess(`Coupon applied! - ৳ ${amount.toLocaleString()} discount.`);
    } catch (err: any) {
      setDiscountValue(0);
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const subtotal = getTotalPrice();
  const deliveryFee = 50;
  const tax = Math.round(subtotal * 0.1);
  const total = Math.max(0, subtotal + deliveryFee + tax - discountValue);

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4 animate-fadeInUp">
          <button
            onClick={() => router.back()}
            className="p-2.5 hover:bg-white rounded-xl transition shadow-sm border border-gray-200"
          >
            <IoArrowBack size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Checkout
            </h1>
            <p className="text-gray-500 text-sm">
              Review your order and complete delivery details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column — Cart Items + Delivery Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <Card className="bg-white animate-fadeInUp">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Cart Items ({items.length})
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-orange-600 font-bold">
                        ৳ {item.price.toLocaleString()} each
                      </p>
                    </div>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <IoRemove size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <IoAdd size={14} />
                      </button>
                    </div>
                    <p className="font-bold text-gray-800 text-sm w-20 text-right">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <IoTrash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery Address Form */}
            <Card className="bg-white animate-fadeInUp animate-delay-200">
              <form onSubmit={handleSubmitOrder} className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Delivery Details
                  </h2>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (addressError) setAddressError('');
                      }}
                      placeholder="Enter your full delivery address"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        addressError
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-orange-500'
                      }`}
                    />
                    {addressError && (
                      <p className="text-red-500 text-sm mt-1">
                        {addressError}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Ordering as: {user?.name} ({user?.email})
                  </p>
                </div>

                {/* Mock Payment Section */}
                <div className="pt-4 border-t border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4 text-gray-600 font-semibold">
                      💳 Credit Card (Mock Integration)
                    </div>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="Card Number (e.g. 4242 4242 4242 4242)" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" 
                      />
                      <div className="grid grid-cols-2 gap-3">
                         <input 
                           type="text" 
                           placeholder="MM/YY" 
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" 
                         />
                         <input 
                           type="text" 
                           placeholder="CVC" 
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" 
                         />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  className="!rounded-xl"
                >
                  Pay & Place Order — ৳ {total.toLocaleString()}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column — Order Summary */}
          <div>
            <Card className="bg-white sticky top-20 animate-fadeInUp animate-delay-300">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal ({items.length} items)</span>
                  <span>৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Delivery Fee</span>
                  <span>৳ {deliveryFee}</span>
                </div>
                {discountValue > 0 && (
                  <div className="flex justify-between text-green-600 text-sm font-semibold">
                    <span>Discount Included</span>
                    <span>- ৳ {discountValue.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Tax (10%)</span>
                  <span>৳ {tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl mb-4">
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-2xl font-extrabold text-orange-600">
                  ৳ {total.toLocaleString()}
                </span>
              </div>
              
              {/* Coupon Section */}
              <div className="pt-2">
                 <p className="text-sm font-semibold text-gray-700 mb-2">Have a promo code?</p>
                 <div className="flex gap-2">
                   <input 
                      type="text" 
                      placeholder="e.g. WELCOME10"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 uppercase"
                   />
                   <button 
                     type="button"
                     onClick={handleApplyCoupon}
                     disabled={validatingCoupon || !couponCode}
                     className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                   >
                     {validatingCoupon ? '...' : 'Apply'}
                   </button>
                 </div>
                 {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                 {couponSuccess && <p className="text-green-600 font-semibold text-xs mt-2">{couponSuccess}</p>}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
