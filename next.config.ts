import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all for flexibility during development/curation, or restrict to known ones
      },
    ],
  },
};

export default nextConfig;
