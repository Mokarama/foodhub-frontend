'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMealById, getReviews, createReview, toggleWishlist, getWishlist } from '@/src/lib/api';
import { useCart } from '@/src/context/CartContext';
import { useAuthContext } from '@/src/context/AuthContext';
import { Button, Loading, ErrorBoundary, Toast } from '@/src/components/ui';
import { IoHeart, IoHeartOutline, IoStar, IoSubwayOutline } from 'react-icons/io5';
import { getImageUrl } from '@/src/utils/imageUrl';

interface MealDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: { id: string; name: string };
  provider: { id: string; name: string };
  reviews: Review[];
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: { id: string; name: string };
}

export default function MealDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuthContext();
  const { addToCart } = useCart();

  const [meal, setMeal] = useState<MealDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchMealDetails();
    if (user) {
      checkWishlistStatus();
    }
  }, [id, user]);

  const fetchMealDetails = async () => {
    try {
      setLoading(true);
      const res = await getMealById(id);
      setMeal(res.data); // ✅ FIX
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load meal details');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const res = await getWishlist();
      const inWishlist = res.data.some((w: any) => w.mealId === id); // ✅ FIX
      setIsWishlisted(inWishlist);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      setToggleLoading(true);
      const res = await toggleWishlist(id);
      setIsWishlisted(res.data.status === 'added'); // ✅ FIX
    } catch (error) {
      console.error("Wishlist error", error);
    } finally {
      setToggleLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!meal) return;
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

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return router.push('/login');
    try {
      setSubmittingReview(true);
      await createReview({ mealId: id, rating: reviewRating, comment: reviewComment });
      setReviewComment('');
      setReviewRating(5);
      fetchMealDetails();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };



  if (loading) return <div className="p-20 text-center"><Loading /></div>;
  if (error || !meal) return <div className="p-20 text-center text-red-500 font-semibold">{error || 'Meal not found'}</div>;

  const avgRating = meal.reviews.length
    ? (meal.reviews.reduce((acc, r) => acc + r.rating, 0) / meal.reviews.length).toFixed(1)
    : 'New';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-6 lg:p-10 mb-12 animate-fadeInUp">
        
        <div className="relative h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden group">
          <img src={getImageUrl(meal.image)} alt={meal.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <button 
            onClick={handleToggleWishlist}
            disabled={toggleLoading}
            className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all text-red-500"
          >
            {isWishlisted ? <IoHeart size={28} /> : <IoHeartOutline size={28} className="text-gray-500" />}
          </button>
        </div>

        <div className="flex flex-col justify-center">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm w-max mb-4">
            {meal.category.name}
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">{meal.name}</h1>
          <p className="text-xl text-gray-500 mb-6">{meal.description}</p>
          
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <IoStar className="text-yellow-400" size={24} />
              <span className="text-lg font-bold text-gray-900">{avgRating} <span className="text-gray-400 font-normal text-sm">({meal.reviews.length} reviews)</span></span>
            </div>
            <div className="flex flex-col">
               <span className="text-sm text-gray-400">Provider</span>
               <span className="font-semibold text-gray-700">{meal.provider.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <span className="text-4xl font-extrabold text-gray-900">৳{meal.price.toFixed(0)}</span>
          </div>

          <Button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold" variant="primary">
             Add to Cart
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-16 animate-fadeInUp animate-delay-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

        <div className="space-y-6 mb-12">
          {meal.reviews.length === 0 ? (
            <div className="p-8 bg-gray-50 rounded-2xl text-center text-gray-500">No reviews yet. Be the first!</div>
          ) : (
            meal.reviews.map(review => (
              <div key={review.id} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-gray-900">{review.user.name}</span>
                  <div className="flex bg-orange-50 px-2 py-1 rounded-lg">
                    {[...Array(review.rating)].map((_, i) => <IoStar key={i} className="text-yellow-400" size={16} />)}
                  </div>
                </div>
                {review.comment && <p className="text-gray-600">{review.comment}</p>}
              </div>
            ))
          )}
        </div>

        {user?.role === 'CUSTOMER' && (
          <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={submitReview} className="space-y-4">
               <div>
                  <label className="block text-sm font-semibold mb-2">Rating</label>
                  <select 
                    value={reviewRating} 
                    onChange={e => setReviewRating(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-gray-200"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Poor</option>
                    <option value={1}>1 - Terrible</option>
                  </select>
               </div>
               <div>
                 <label className="block text-sm font-semibold mb-2">Comment (optional)</label>
                 <textarea 
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Tell us what you thought..."
                    className="w-full p-3 rounded-xl border border-gray-200 h-24 resize-none"
                 />
               </div>
               <Button type="submit" disabled={submittingReview} variant="primary">
                 {submittingReview ? 'Submitting...' : 'Submit Review'}
               </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}