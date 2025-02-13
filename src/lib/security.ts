import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { Express, Request, Response, NextFunction } from 'express';
import { createHash, randomBytes } from 'crypto';
import session from 'express-session';
import express from 'express';

// Rate limiting yapılandırması
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına maksimum istek
  message: 'Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin.',
  standardHeaders: true,
  legacyHeaders: false,
});

// API güvenlik başlıkları
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.openai.com', 'https://api.replicate.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: true,
  xssFilter: true,
});

// CORS yapılandırması
export const corsOptions = cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 saat
});

// Şifre güvenliği
export class PasswordSecurity {
  private static readonly SALT_LENGTH = 32;
  private static readonly HASH_ITERATIONS = 100000;
  private static readonly HASH_LENGTH = 64;
  private static readonly HASH_ALGORITHM = 'sha512';

  static hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    return new Promise((resolve, reject) => {
      const salt = randomBytes(this.SALT_LENGTH).toString('hex');

      try {
        const hash = createHash(this.HASH_ALGORITHM)
          .update(password + salt)
          .digest('hex')
          .repeat(this.HASH_ITERATIONS);

        resolve({ hash, salt });
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyPassword(
    password: string,
    hash: string,
    salt: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const computedHash = createHash(this.HASH_ALGORITHM)
          .update(password + salt)
          .digest('hex')
          .repeat(this.HASH_ITERATIONS);

        resolve(computedHash === hash);
      } catch (error) {
        reject(error);
      }
    });
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 12) {
      errors.push('Şifre en az 12 karakter uzunluğunda olmalıdır.');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Şifre en az bir büyük harf içermelidir.');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Şifre en az bir küçük harf içermelidir.');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Şifre en az bir rakam içermelidir.');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Şifre en az bir özel karakter içermelidir.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// İki faktörlü doğrulama
export class TwoFactorAuth {
  private static readonly TOKEN_LENGTH = 6;
  private static readonly TOKEN_VALIDITY = 5 * 60 * 1000; // 5 dakika

  static generateToken(): string {
    return randomBytes(32)
      .toString('hex')
      .slice(0, this.TOKEN_LENGTH);
  }

  static verifyToken(token: string, storedToken: string): boolean {
    return token === storedToken;
  }
}

// JWT güvenliği
export class JWTSecurity {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRY = '1h';

  static sign(payload: any): string {
    const jwt = require('jsonwebtoken');
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRY });
  }

  static verify(token: string): any {
    const jwt = require('jsonwebtoken');
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

// XSS koruma
export function sanitizeInput(input: string): string {
  const xss = require('xss');
  return xss(input);
}

// SQL enjeksiyon koruması
export function escapeSQLInput(input: string): string {
  const sqlstring = require('sqlstring');
  return sqlstring.escape(input);
}

// Güvenlik middleware'i
export function setupSecurity(app: Express): void {
  // Rate limiting
  app.use(rateLimiter);

  // Güvenlik başlıkları
  app.use(securityHeaders);

  // CORS
  app.use(corsOptions);

  // Request body limiti
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Session güvenliği
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 saat
      },
    })
  );
}
