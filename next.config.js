/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Remove output: 'export' if it exists to allow API routes
  trailingSlash: true,
  // Ensure API routes work properly
  experimental: {
    serverComponentsExternalPackages: ['@google/generative-ai']
  }
};

module.exports = nextConfig;