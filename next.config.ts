import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Suppress the custom-font-in-head warning for runtime loading.
    ignoreDuringBuilds: false,
  },
  experimental: {
    // Turbopack is stable in Next.js 15+
  },
};

export default nextConfig;
