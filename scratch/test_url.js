const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
  if (url.startsWith('http')) return url;
  
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  
  if (cleanPath.startsWith('/uploads/')) {
    return cleanPath;
  }
  
  const NEXT_PUBLIC_API_URL = 'http://localhost:5000/api';
  const baseUrl = NEXT_PUBLIC_API_URL.trim().replace('/api', '');
  
  return `${baseUrl}/public${cleanPath}`;
};

console.log('Case 1:', getImageUrl('/uploads/foods/burger.jpg'));
console.log('Case 2:', getImageUrl('uploads/foods/burger.jpg'));
console.log('Case 3:', getImageUrl('/public/uploads/foods/burger.jpg'));
