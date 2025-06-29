/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  trailingSlash: true,
  // Enable static export for Netlify
  output: 'export',
  // Disable server-side features for static export
  experimental: {
    serverComponentsExternalPackages: ['@google/generative-ai']
  },
  // Configure for Netlify deployment
  distDir: 'out',
};

module.exports = nextConfig;