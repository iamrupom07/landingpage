import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow server actions to call the backend API
  experimental: {},
  // Expose the API URL to server components / actions
  env: {
    API_URL: process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  },
};

export default nextConfig;
