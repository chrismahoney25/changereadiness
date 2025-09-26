/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,
  output: 'standalone',
  poweredByHeader: false,
  images: {
    domains: [],
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ['@react-pdf/renderer']
  }
}

export default nextConfig