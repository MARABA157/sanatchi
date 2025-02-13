/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  env: {
    VITE_HUGGINGFACE_API_TOKEN: process.env.VITE_HUGGINGFACE_API_TOKEN,
  },
}
