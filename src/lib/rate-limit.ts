import { LRUCache } from 'lru-cache';

export class RateLimit {
  private tokenCache: LRUCache<string, number>;

  constructor() {
    this.tokenCache = new LRUCache({
      max: 500,
      ttl: 60000, // 1 dakika
    });
  }

  public check(token: string, limit: number): boolean {
    const tokenCount = this.tokenCache.get(token) || 0;
    
    if (tokenCount >= limit) {
      return false;
    }

    this.tokenCache.set(token, tokenCount + 1);
    return true;
  }
}

// Rate limiter instance
export const rateLimiter = new RateLimit();
