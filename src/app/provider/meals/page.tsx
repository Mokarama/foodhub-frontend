'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/src/context/AuthContext';
import api from '@/src/lib/api';
import { Card, Button, Input, Loading } from '@/src/components/ui';
import { IoCloudUpload, IoCheckmarkCircle } from 'react-icons/io5';

interface Category {
  id: string;
  name: string;
}

export default function ProviderMealsPage() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user && user.role !== 'PROVIDER') {
      router.push('/dashboard');
    } else {
      fetchCategories();
    }
  }, [user, router]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
      const fastFood = res.data.find((cat: Category) => cat.name === 'Fast Food');
      if (fastFood) {
        setForm(prev => ({ ...prev, categoryId: fastFood.id }));
      } else if (res.data.length > 0) {
        setForm(prev => ({ ...prev, categoryId: res.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to categories', err);
    } finally {
      setLoadingCats(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("File must be less than 5MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.description || !form.categoryId) {
      setError('Please fill out all required basic fields.');
      return;
    }
    if (!imageFile) {
      setError('Please upload an image representation of your meal.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Build FormData for multipart transport
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('categoryId', form.categoryId);
      formData.append('image', imageFile);

      await api.post('/meals', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Meal created successfully! It is now live on the storefront.');
      setForm({ name: '', price: '', description: '', categoryId: categories[0]?.id || '' });
      setImageFile(null);
      setPreviewUrl(null);
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Upload failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCats) return <div className="p-20 text-center"><Loading /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fadeInUp">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Add New Meal</h1>
        <p className="text-gray-500 mt-2">Publish a new food item to your storefront directly.</p>
      </div>

      <Card className="p-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-semibold border border-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 font-semibold border border-green-200 flex items-center gap-2">
             <IoCheckmarkCircle className="text-xl" />
             {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column Data */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Name</label>
                <Input 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  placeholder="E.g., Spicy Tuna Roll"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (৳)</label>
                <Input 
                  type="number"
                  step="0.01"
                  value={form.price} 
                  onChange={e => setForm({...form, price: e.target.value})} 
                  placeholder="25.50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors appearance-none bg-gray-50 font-medium text-gray-700 cursor-pointer"
                    value={form.categoryId}
                    onChange={e => setForm({...form, categoryId: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories
                      .filter(cat => ['Fast Food', 'Dessert'].includes(cat.name))
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Supported: Fast Food, Dessert</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors bg-gray-50 h-32 resize-none"
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  placeholder="Describe your meal..."
                  required
                />
              </div>
            </div>

            {/* Right Column Upload */}
            <div className="md:sticky md:top-24">
              <label className="block text-sm font-semibold text-gray-700 mb-2">High Quality Image</label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-2xl aspect-[4/3] md:aspect-square flex flex-col items-center justify-center relative bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer overflow-hidden group shadow-inner">
                <input 
                   type="file" 
                   accept="image/*" 
                   onChange={handleImageChange}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 p-6 text-center">
                    <IoCloudUpload size={48} className="mb-4 text-gray-300 group-hover:text-orange-400 transition-colors" />
                    <p className="font-semibold text-gray-600 mb-1">Click to upload image</p>
                    <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
                
                {previewUrl && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold flex items-center gap-2">
                       <IoCloudUpload /> Change Image
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button type="submit" disabled={submitting || !imageFile}>
              {submitting ? 'Publishing Meal...' : 'Publish Meal'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
