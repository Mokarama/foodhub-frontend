import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://foodhub-backend-9pkw.onrender.com/api';
    const backendUrl = rawApiUrl.trim().replace(/\/api\/?$/, '').replace(/\/$/, '');
    
    return [
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/public/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
