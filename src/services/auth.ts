import api from '../lib/api';

/**
 * Auth service — thin wrappers for backward compatibility.
 * The main api.ts now exports these directly, but older code
 * may still import from this file.
 */

export const registerUser = async (data: any) => {
  return await api.post('/auth/register', data);
};

export const getCurrentUser = async () => {
  return await api.get('/auth/me');
};

export const loginUser = async (data: any) => {
  return await api.post('/auth/login', data);
};