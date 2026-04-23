import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://foodhub-backend-9pkw.onrender.com/api').trim().replace('/api', '');
    return [
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/public/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
