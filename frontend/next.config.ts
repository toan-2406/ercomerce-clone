import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cellphones.com.vn', 'cdn.cellphones.com.vn', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
