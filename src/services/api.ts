import axios from 'axios';

/**
 * API Service Layer
 * Central Axios instance with auth token injection and 401 auto-logout.
 * All backend endpoint functions are exported from here.
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// ── Request interceptor: attach JWT token ──
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor: auto-logout on 401 ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export { api };
export default api;

// ============================================
//  AUTH endpoints
// ============================================
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => api.post('/auth/register', data);

export const loginUser = async (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const getCurrentUser = async () => api.get('/auth/me');

// ============================================
//  FOOD IMAGES endpoints
// ============================================
export const getFoodImages = async () => api.get('/foods/images');

// ============================================
//  MEAL endpoints
// ============================================
export const getMeals = async (params?: {
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
}) => api.get('/meals', { params });

export const getMealById = async (id: string) => api.get(`/meals/${id}`);

export const createMeal = async (data: {
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: string;
}) => api.post('/meals', data);

export const updateMeal = async (
  id: string,
  data: Partial<{
    name: string;
    price: number;
    description: string;
    image: string;
    categoryId: string;
  }>,
) => api.put(`/meals/${id}`, data);

export const deleteMeal = async (id: string) => api.delete(`/meals/${id}`);

// ============================================
//  ORDER endpoints
// ============================================
export const createOrder = async (data: {
  items: Array<{ mealId: string; quantity: number }>;
  address: string;
}) => api.post('/orders', data);

export const getUserOrders = async () => api.get('/orders');

export const getOrderById = async (id: string) => api.get(`/orders/${id}`);

export const updateOrderStatus = async (id: string, status: string) =>
  api.patch(`/orders/${id}/status`, { status });

// ============================================
//  REVIEW endpoints
// ============================================
export const getReviews = async (mealId?: string) =>
  api.get('/reviews', { params: mealId ? { mealId } : {} });

export const createReview = async (data: {
  mealId: string;
  rating: number;
  comment?: string;
}) => api.post('/reviews', data);

// ============================================
//  CATEGORY endpoints (public)
// ============================================
export const getCategories = async () => api.get('/categories');

export const createCategory = async (name: string) =>
  api.post('/categories', { name });

// ============================================
//  ADMIN endpoints
// ============================================
export const adminGetUsers = async () => api.get('/admin/users');

export const adminUpdateUserStatus = async (id: string, status: string) =>
  api.patch(`/admin/users/${id}`, { status });

export const adminGetAllOrders = async () => api.get('/admin/orders');

export const adminGetCategories = async () => api.get('/admin/categories');

export const adminCreateCategory = async (name: string) =>
  api.post('/admin/categories', { name });

export const adminDeleteCategory = async (id: string) =>
  api.delete(`/admin/categories/${id}`);

// ============================================
//  WISHLIST endpoints
// ============================================
export const toggleWishlist = async (mealId: string) =>
  api.post('/wishlist', { mealId });

export const getWishlist = async () => api.get('/wishlist');