import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');
    return [
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/public/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
