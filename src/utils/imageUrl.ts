/**
 * Utility to construct absolute URLs for images stored on the backend.
 * Handles both absolute URLs (external) and relative paths (local uploads).
 */
export const getImageUrl = (url?: string) => {
  if (!url) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
  if (url.startsWith('http')) return url;
  
  // Use the API URL from environment variables, stripping the /api suffix to get the base
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
  
  // Ensure the relative path starts with a slash
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  
  return `${baseUrl}/public${cleanPath}`;
};
