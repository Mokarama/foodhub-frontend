import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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
  }
);

export { api };
export default api;

// ============================================
//  AUTH endpoints
// ============================================
export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => api.post('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const getCurrentUser = () => api.get('/auth/me');

// ============================================
//  FOOD IMAGES endpoints
// ============================================
export const getFoodImages = () => api.get('/foods');

// ============================================
//  MEAL endpoints
// ============================================
export const getMeals = (params?: {
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
}) => api.get('/meals', { params });

export const getMealById = (id: string) => api.get(`/meals/${id}`);

export const createMeal = (data: {
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: string;
}) => api.post('/meals', data);

export const updateMeal = (
  id: string,
  data: Partial<{
    name: string;
    price: number;
    description: string;
    image: string;
    categoryId: string;
  }>
) => api.put(`/meals/${id}`, data);

export const deleteMeal = (id: string) => api.delete(`/meals/${id}`);

// ============================================
//  ORDER endpoints
// ============================================
export const createOrder = (data: {
  items: Array<{ mealId: string; quantity: number }>;
  address: string;
}) => api.post('/orders', data);

export const getUserOrders = () => api.get('/orders');

export const getOrderById = (id: string) => api.get(`/orders/${id}`);

export const updateOrderStatus = (id: string, status: string) =>
  api.patch(`/orders/${id}/status`, { status });

// ============================================
//  REVIEW endpoints
// ============================================
export const getReviews = (mealId?: string) =>
  api.get('/reviews', { params: mealId ? { mealId } : {} });

export const createReview = (data: {
  mealId: string;
  rating: number;
  comment?: string;
}) => api.post('/reviews', data);

// ============================================
//  CATEGORY endpoints
// ============================================
export const getCategories = () => api.get('/categories');

export const createCategory = (name: string) =>
  api.post('/categories', { name });

// ============================================
//  ADMIN endpoints
// ============================================
export const adminGetUsers = () => api.get('/admin/users');

export const adminUpdateUserStatus = (id: string, status: string) =>
  api.patch(`/admin/users/${id}`, { status });

export const adminGetAllOrders = () => api.get('/admin/orders');

export const adminGetCategories = () => api.get('/admin/categories');

export const adminCreateCategory = (name: string) =>
  api.post('/admin/categories', { name });

export const adminDeleteCategory = (id: string) =>
  api.delete(`/admin/categories/${id}`);

// ============================================
//  WISHLIST endpoints
// ============================================
export const toggleWishlist = (mealId: string) =>
  api.post('/wishlist', { mealId });

export const getWishlist = () => api.get('/wishlist');
