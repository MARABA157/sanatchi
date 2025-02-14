/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://*.replicate.delivery;
              media-src 'self' blob: https://*.replicate.delivery;
              connect-src 'self' 
                https://*.supabase.co 
                https://huggingface.co 
                https://*.huggingface.co 
                https://api-inference.huggingface.co
                https://api.replicate.com
                https://*.replicate.com
                http://localhost:11434;
              font-src 'self';
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ];
  },
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
