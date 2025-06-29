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
  // Configure for Netlify deployment
  distDir: 'out',
};

module.exports = nextConfig;