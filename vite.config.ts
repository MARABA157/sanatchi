import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 3000,
      strictPort: true,
      host: true,
      open: true,
      headers: {
        'Content-Security-Policy': `
          default-src 'self';
          connect-src 'self' 
            https://*.supabase.co 
            https://huggingface.co 
            https://*.huggingface.co 
            https://api-inference.huggingface.co
            https://*.stability.ai
            https://api.stability.ai;
          img-src 'self' blob: data:;
          media-src 'self' blob: data:;
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          style-src 'self' 'unsafe-inline';
          frame-src 'self';
        `.replace(/\s+/g, ' ').trim(),
      },
      proxy: {
        '/api/generate': {
          target: 'http://localhost:11434',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/generate/, '/api/generate'),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          }
        },
        '/huggingface': {
          target: 'https://api-inference.huggingface.co',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/huggingface/, ''),
          headers: {
            'Authorization': `Bearer ${env.VITE_HUGGINGFACE_API_KEY}`
          }
        }
      }
    },
    define: {
      'process.env.VITE_HUGGINGFACE_API_KEY': JSON.stringify(env.VITE_HUGGINGFACE_API_KEY)
    }
  }
})
