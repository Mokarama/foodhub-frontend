// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async rewrites() {
//     let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://foodhub-backend-9pkw.onrender.com/api';
    

//     rawApiUrl = rawApiUrl.trim().replace(/^["']|["']$/g, '').trim();
    
   
//     if (rawApiUrl && !rawApiUrl.startsWith('http') && !rawApiUrl.startsWith('/')) {
//       rawApiUrl = `https://${rawApiUrl}`;
//     }   
//     module.exports = {
//       images: {
//         remotePatterns: [
//           { protocol: 'https', hostname: 'foodhub-backend-9pkw.onrender.com' },
//         ],
//       },
//     }

//     const backendUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    
   
//     const safeDestination = backendUrl 
//       ? `${backendUrl}/public/uploads/:path*`
//       : 'https://foodhub-backend-9pkw.onrender.com/public/uploads/:path*';
    
//     return [
//       {
//         source: "/uploads/:path*",
//         destination: safeDestination,
//       },
//     ];
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'foodhub-backend-9pkw.onrender.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  async rewrites() {
    let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://foodhub-backend-9pkw.onrender.com/api';

    // Cleanup URL
    rawApiUrl = rawApiUrl.trim().replace(/^["']|["']$/g, '').trim();

    if (rawApiUrl && !rawApiUrl.startsWith('http') && !rawApiUrl.startsWith('/')) {
      rawApiUrl = `https://${rawApiUrl}`;
    }

    const backendUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

    const safeDestination = backendUrl 
      ? `${backendUrl}/public/uploads/:path*`
      : 'https://foodhub-backend-9pkw.onrender.com/public/uploads/:path*';

    return [
      {
        source: "/uploads/:path*",
        destination: safeDestination,
      },
    ];
  },
};

export default nextConfig;


//
//
//
//
//