/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the server runtime: /api/chat and /api/health are dynamic routes.
  images: { unoptimized: true },
  reactStrictMode: true,
};
module.exports = nextConfig
