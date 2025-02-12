import { Redis } from '@upstash/redis';

interface CacheConfig {
  url: string;
  token: string;
  ttl?: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CacheManager {
  private redis: Redis;
  private defaultTTL: number;
  private cache: Map<string, CacheEntry<any>>;
  private maxEntries: number;

  constructor(config: CacheConfig, maxEntries: number = 1000) {
    this.redis = new Redis({
      url: config.url,
      token: config.token,
    });
    this.defaultTTL = config.ttl || 3600; // Varsayılan 1 saat
    this.cache = new Map();
    this.maxEntries = maxEntries;
  }

  // Veriyi önbelleğe ekle
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      if (this.cache.size >= this.maxEntries) {
        this.evictOldest();
      }

      this.cache.set(key, {
        data: value,
        timestamp: Date.now(),
        ttl: (ttl || this.defaultTTL) * 1000, // Convert to milliseconds
      });

      await this.redis.set(key, JSON.stringify(value), {
        ex: ttl || this.defaultTTL,
      });
    } catch (error) {
      console.error('Cache set error:', error);
      throw new Error('Veri önbelleğe eklenirken bir hata oluştu');
    }
  }

  // Veriyi önbellekten al
  async get<T>(key: string): Promise<T | null> {
    try {
      const entry = this.cache.get(key);
      if (!entry) {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
      }

      const now = Date.now();
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Cache get error:', error);
      throw new Error('Veri önbellekten alınırken bir hata oluştu');
    }
  }

  // Veriyi önbellekten sil
  async delete(key: string): Promise<void> {
    try {
      this.cache.delete(key);
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
      throw new Error('Veri önbellekten silinirken bir hata oluştu');
    }
  }

  // Önbelleği tamamen temizle
  async clear(): Promise<void> {
    try {
      this.cache.clear();
      await this.redis.flushall();
    } catch (error) {
      console.error('Cache clear error:', error);
      throw new Error('Önbellek temizlenirken bir hata oluştu');
    }
  }

  // Önbellekteki anahtarları listele
  async keys(pattern: string = '*'): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      console.error('Cache keys error:', error);
      throw new Error('Önbellek anahtarları listelenirken bir hata oluştu');
    }
  }

  // Önbellek istatistiklerini al
  async stats(): Promise<{
    keys: number;
    memory: number;
    hits: number;
    misses: number;
  }> {
    try {
      const info = await this.redis.info();
      return {
        keys: parseInt(info.keyspace_hits) || 0,
        memory: parseInt(info.used_memory) || 0,
        hits: parseInt(info.keyspace_hits) || 0,
        misses: parseInt(info.keyspace_misses) || 0,
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      throw new Error('Önbellek istatistikleri alınırken bir hata oluştu');
    }
  }

  // Service Worker önbelleğini güncelle
  async updateServiceWorkerCache(assets: string[]): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const cache = await caches.open('v1');
        await cache.addAll(assets);
      }
    } catch (error) {
      console.error('Service worker cache update error:', error);
      throw new Error('Service worker önbelleği güncellenirken bir hata oluştu');
    }
  }

  // Önbellekteki bir değerin süresini güncelle
  async updateTTL(key: string, ttl: number): Promise<boolean> {
    try {
      const value = await this.get(key);
      if (value === null) return false;

      await this.set(key, value, ttl);
      return true;
    } catch (error) {
      console.error('Cache TTL update error:', error);
      throw new Error('Önbellek süresi güncellenirken bir hata oluştu');
    }
  }

  // Birden fazla anahtarı tek seferde al
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await this.redis.mget(...keys);
      return values.map(value => (value ? JSON.parse(value) : null));
    } catch (error) {
      console.error('Cache multi-get error:', error);
      throw new Error('Veriler önbellekten alınırken bir hata oluştu');
    }
  }

  // Birden fazla anahtarı tek seferde ekle
  async mset<T>(entries: { key: string; value: T }[], ttl?: number): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();
      entries.forEach(({ key, value }) => {
        pipeline.set(key, JSON.stringify(value), {
          ex: ttl || this.defaultTTL,
        });
      });
      await pipeline.exec();
    } catch (error) {
      console.error('Cache multi-set error:', error);
      throw new Error('Veriler önbelleğe eklenirken bir hata oluştu');
    }
  }

  // Veriyi al veya ayarla
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    try {
      const cachedValue = await this.get<T>(key);
      if (cachedValue !== null) return cachedValue;

      const freshValue = await fetchFn();
      await this.set(key, freshValue, ttl);
      return freshValue;
    } catch (error) {
      console.error('Cache getOrSet error:', error);
      throw new Error('Önbellek işlemi sırasında bir hata oluştu');
    }
  }

  private evictOldest(): void {
    const oldestKey = Array.from(this.cache.entries())
      .reduce((oldest, current) => {
        return oldest[1].timestamp < current[1].timestamp ? oldest : current;
      })[0];

    this.cache.delete(oldestKey);
  }
}

// Farklı cache instance'ları
export const pageCache = new CacheManager({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
  ttl: 5 * 60, // 5 dakika
});

export const apiCache = new CacheManager({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
  ttl: 60, // 1 dakika
});

export const imageCache = new CacheManager({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
  ttl: 30 * 60, // 30 dakika
});

export const userCache = new CacheManager({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
  ttl: 15 * 60, // 15 dakika
});

// Cache hook'u
export function useCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
) {
  return pageCache.getOrSet(key, fetchFn, ttl);
}

// API response cache decorator
export function cacheApiResponse(ttl?: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;
      return apiCache.getOrSet(cacheKey, () => originalMethod.apply(this, args), ttl);
    };

    return descriptor;
  };
}

// Service worker cache
export async function cacheInServiceWorker(
  urls: string[],
  cacheName = 'app-cache-v1'
) {
  if ('serviceWorker' in navigator) {
    try {
      const cache = await caches.open(cacheName);
      await cache.addAll(urls);
      console.log('Service worker cache updated');
    } catch (error) {
      console.error('Error updating service worker cache:', error);
    }
  }
}

// Local storage cache
export const localStorageCache = {
  set<T>(key: string, value: T, ttl = 24 * 60 * 60 * 1000): void {
    const item: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { data, timestamp, ttl } = JSON.parse(item) as CacheEntry<T>;
    const isExpired = Date.now() - timestamp > ttl;

    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  },
};

type CacheItem<T> = {
  value: T;
  timestamp: number;
  ttl: number;
};
