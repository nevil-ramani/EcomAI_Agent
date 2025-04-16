import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i5.walmartimages.com' },
    ],
  },

};

export default nextConfig;