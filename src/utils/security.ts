import { randomBytes, createHash } from 'crypto';

export class SecurityUtils {
  private static instance: SecurityUtils;
  private csrfTokens: Map<string, { token: string; expires: number }> = new Map();

  private constructor() {}

  public static getInstance(): SecurityUtils {
    if (!SecurityUtils.instance) {
      SecurityUtils.instance = new SecurityUtils();
    }
    return SecurityUtils.instance;
  }

  // Generate CSRF token
  public generateCSRFToken(userId: string): string {
    const token = randomBytes(32).toString('hex');
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    this.csrfTokens.set(userId, { token, expires });
    return token;
  }

  // Validate CSRF token
  public validateCSRFToken(userId: string, token: string): boolean {
    const storedData = this.csrfTokens.get(userId);
    
    if (!storedData) {
      return false;
    }

    if (Date.now() > storedData.expires) {
      this.csrfTokens.delete(userId);
      return false;
    }

    return storedData.token === token;
  }

  // Clean expired CSRF tokens
  public cleanExpiredTokens(): void {
    const now = Date.now();
    for (const [userId, data] of this.csrfTokens.entries()) {
      if (now > data.expires) {
        this.csrfTokens.delete(userId);
      }
    }
  }

  // Content Security Policy headers
  public getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https:",
        "media-src 'self'",
        "object-src 'none'",
        "frame-src 'self'",
        "worker-src 'self' blob:",
      ].join('; '),
    };
  }

  // Generate secure hash
  public generateHash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  // Generate secure random string
  public generateRandomString(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  // Sanitize file path
  public sanitizeFilePath(path: string): string {
    return path
      .replace(/\.\./g, '') // Prevent directory traversal
      .replace(/[^a-zA-Z0-9/._-]/g, '') // Allow only safe characters
      .replace(/\/+/g, '/'); // Normalize slashes
  }

  // Validate and sanitize URL
  public sanitizeURL(url: string): string | null {
    try {
      const parsed = new URL(url);
      const allowedProtocols = ['http:', 'https:'];
      
      if (!allowedProtocols.includes(parsed.protocol)) {
        return null;
      }

      return parsed.toString();
    } catch {
      return null;
    }
  }

  // Rate limiting check (uses the previously created RateLimiter)
  public checkRateLimit(identifier: string, limit: number, windowMs: number): boolean {
    const key = this.generateHash(identifier);
    const now = Date.now();
    const windowKey = Math.floor(now / windowMs);
    const windowStart = windowKey * windowMs;
    const windowEnd = windowStart + windowMs;

    const requestCount = 0; // Implement actual request counting logic
    return requestCount < limit;
  }
}

export const securityUtils = SecurityUtils.getInstance();

// Security middleware for Express
export const securityMiddleware = {
  // Add security headers
  addSecurityHeaders: (req: any, res: any, next: () => void) => {
    // CSRF Protection
    res.cookie('XSRF-TOKEN', securityUtils.generateCSRFToken(req.user?.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Other Security Headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Add CSP headers
    const cspHeaders = securityUtils.getCSPHeaders();
    Object.entries(cspHeaders).forEach(([header, value]) => {
      res.setHeader(header, value);
    });

    next();
  },

  // Verify CSRF token
  verifyCSRFToken: (req: any, res: any, next: () => void) => {
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    
    if (!token || !securityUtils.validateCSRFToken(req.user?.id, token)) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    next();
  }
};
