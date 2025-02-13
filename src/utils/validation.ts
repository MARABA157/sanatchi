import { z } from 'zod';

// User related schemas
export const userSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

// NFT related schemas
export const nftSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  price: z
    .number()
    .min(0, 'Price cannot be negative')
    .max(1000000, 'Price cannot exceed 1,000,000'),
  royalties: z
    .number()
    .min(0, 'Royalties cannot be negative')
    .max(25, 'Royalties cannot exceed 25%'),
});

// Comment related schemas
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment must be less than 500 characters'),
});

// URL validation
export const urlSchema = z
  .string()
  .url('Invalid URL')
  .refine((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, 'Invalid URL format');

// File validation
export const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.string().refine((type) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(type);
  }, 'File type not supported'),
});

// Social media handle validation
export const socialMediaSchema = z.object({
  twitter: z
    .string()
    .regex(/^@?[a-zA-Z0-9_]{1,15}$/, 'Invalid Twitter handle')
    .optional(),
  instagram: z
    .string()
    .regex(/^[a-zA-Z0-9_.]{1,30}$/, 'Invalid Instagram handle')
    .optional(),
  discord: z
    .string()
    .regex(/^.{3,32}#[0-9]{4}$/, 'Invalid Discord handle')
    .optional(),
});

// Validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: 'Validation failed',
    };
  }
}

// Sanitization functions
export function sanitizeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_');
}
