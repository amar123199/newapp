/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";


const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav:true,
  aggressiveFrontEndNavCaching:true,
  reloadOnOnline:true,
  swcMinify:true,
  disable:false,
  workboxOptions:{
    disableDevLogs:true,
  },
});

export default withPWA({
  reactStrictMode: true,
  output: 'export', // Add this line for static exports
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'], // Enable package optimization for Chakra UI
  },
  // Your Next.js config
});