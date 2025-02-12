import { rateLimiter } from '@/lib/rate-limit';

export async function securityMiddleware(request: Request) {
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Rate limiting kontrolü
  if (!rateLimiter.check(clientIP, 100)) { // IP başına dakikada 100 istek
    return new Response('Too Many Requests', { status: 429 });
  }

  // CORS kontrolü
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': process.env.VITE_APP_URL || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Güvenlik başlıkları
  const headers = new Headers({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  });

  // JWT token kontrolü
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (token) {
    try {
      // Token doğrulama işlemi burada yapılabilir
      // const decoded = await verifyToken(token);
    } catch (error) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  return new Response(null, { headers });
}
