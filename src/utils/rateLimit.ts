interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max number of requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  check(identifier: string): { allowed: boolean; resetTime: number } {
    const now = Date.now();
    const record = this.store[identifier];

    // If no record exists or the window has expired, create a new record
    if (!record || now > record.resetTime) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      return { allowed: true, resetTime: this.store[identifier].resetTime };
    }

    // If within the window, check if limit is exceeded
    if (record.count >= this.config.maxRequests) {
      return { allowed: false, resetTime: record.resetTime };
    }

    // Increment the counter
    record.count++;
    return { allowed: true, resetTime: record.resetTime };
  }

  // Clean up expired records
  cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}

// Create instances for different rate limits
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 100  // 100 requests per window
});

export const authRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 5  // 5 login attempts per hour
});

// Cleanup expired records every hour
setInterval(() => {
  apiRateLimiter.cleanup();
  authRateLimiter.cleanup();
}, 60 * 60 * 1000);

interface RateLimitOptions {
  maxRequests: number;
  timeWindow: number;
}

export const rateLimit = ({ maxRequests, timeWindow }: RateLimitOptions) => {
  const requests: number[] = [];

  return async (fn: () => Promise<any>) => {
    const now = Date.now();
    requests.push(now);

    // Remove expired timestamps
    const validRequests = requests.filter(
      timestamp => now - timestamp < timeWindow
    );

    if (validRequests.length > maxRequests) {
      const oldestRequest = validRequests[0];
      const timeToWait = timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }

    return fn();
  };
};
