/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Add this line for static exports
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'], // Enable package optimization for Chakra UI
  },
};

export default nextConfig;
