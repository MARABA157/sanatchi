import { supabase } from './supabase';
import { trackEvent } from './analytics';

interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordMinLength: number;
  requireSpecialChar: boolean;
  requireNumber: boolean;
  requireUppercase: boolean;
  mfaEnabled: boolean;
}

interface LoginAttempt {
  userId: string;
  timestamp: Date;
  success: boolean;
  ipAddress: string;
  userAgent: string;
}

const DEFAULT_CONFIG: SecurityConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  passwordMinLength: 8,
  requireSpecialChar: true,
  requireNumber: true,
  requireUppercase: true,
  mfaEnabled: false,
};

export async function validatePassword(password: string): Promise<boolean> {
  const config = await getSecurityConfig();

  if (password.length < config.passwordMinLength) {
    return false;
  }

  if (config.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false;
  }

  if (config.requireNumber && !/\d/.test(password)) {
    return false;
  }

  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    return false;
  }

  return true;
}

export async function recordLoginAttempt(
  userId: string,
  success: boolean,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  const attempt: LoginAttempt = {
    userId,
    timestamp: new Date(),
    success,
    ipAddress,
    userAgent,
  };

  const { error } = await supabase
    .from('login_attempts')
    .insert([attempt]);

  if (error) {
    console.error('Failed to record login attempt:', error);
    return;
  }

  if (!success) {
    const recentAttempts = await getRecentLoginAttempts(userId);
    const config = await getSecurityConfig();

    if (recentAttempts.length >= config.maxLoginAttempts) {
      await lockAccount(userId);
      trackEvent('account_locked', {
        user_id: userId,
        reason: 'too_many_attempts',
        attempts: recentAttempts.length,
      });
    }
  }
}

export async function isAccountLocked(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('account_locks')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return false;
  }

  const config = await getSecurityConfig();
  const lockTime = new Date(data.created_at).getTime();
  const now = Date.now();

  return now - lockTime < config.lockoutDuration;
}

async function getRecentLoginAttempts(userId: string): Promise<LoginAttempt[]> {
  const config = await getSecurityConfig();
  const cutoff = new Date(Date.now() - config.lockoutDuration);

  const { data, error } = await supabase
    .from('login_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('success', false)
    .gte('timestamp', cutoff.toISOString())
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Failed to get recent login attempts:', error);
    return [];
  }

  return data || [];
}

async function lockAccount(userId: string): Promise<void> {
  const { error } = await supabase
    .from('account_locks')
    .insert([{ user_id: userId }]);

  if (error) {
    console.error('Failed to lock account:', error);
  }
}

export async function getSecurityConfig(): Promise<SecurityConfig> {
  const { data, error } = await supabase
    .from('security_config')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    console.warn('Failed to get security config, using defaults:', error);
    return DEFAULT_CONFIG;
  }

  return {
    ...DEFAULT_CONFIG,
    ...data,
  };
}

export async function updateSecurityConfig(
  config: Partial<SecurityConfig>
): Promise<void> {
  const { error } = await supabase
    .from('security_config')
    .update(config)
    .eq('id', 1);

  if (error) {
    console.error('Failed to update security config:', error);
    throw new Error('Failed to update security configuration');
  }

  trackEvent('security_config_updated', {
    changes: Object.keys(config),
  });
}

export function generateSecurityHeaders() {
  return {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function validateFileUpload(file: File): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
  ];

  if (!allowedTypes.includes(file.type)) {
    return false;
  }

  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return false;
  }

  return true;
}

export async function rateLimit(
  userId: string,
  action: string,
  limit: number,
  window: number
): Promise<boolean> {
  const now = Date.now();
  const windowStart = new Date(now - window).toISOString();

  const { count } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('action', action)
    .gte('timestamp', windowStart);

  if (count >= limit) {
    trackEvent('rate_limit_exceeded', {
      user_id: userId,
      action,
      limit,
      window,
    });
    return false;
  }

  await supabase
    .from('rate_limits')
    .insert([
      {
        user_id: userId,
        action,
        timestamp: new Date(now).toISOString(),
      },
    ]);

  return true;
}
