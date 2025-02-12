import { ModelType, GenerationResponse } from '../types';

interface CacheEntry {
  response: GenerationResponse;
  timestamp: number;
  modelVersion: string;
}

export class ModelCache {
  private static instance: ModelCache;
  private cache: Map<string, CacheEntry> = new Map();
  private readonly MAX_CACHE_SIZE = 1000;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 saat

  private constructor() {}

  public static getInstance(): ModelCache {
    if (!ModelCache.instance) {
      ModelCache.instance = new ModelCache();
    }
    return ModelCache.instance;
  }

  private generateCacheKey(modelName: string, prompt: string, type: ModelType): string {
    return `${modelName}:${type}:${prompt}`;
  }

  public set(modelName: string, prompt: string, type: ModelType, response: GenerationResponse, modelVersion: string): void {
    const key = this.generateCacheKey(modelName, prompt, type);
    
    // Önbellek boyutu kontrolü
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      // En eski girişi sil
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      response,
      timestamp: Date.now(),
      modelVersion
    });
  }

  public get(modelName: string, prompt: string, type: ModelType, modelVersion: string): GenerationResponse | null {
    const key = this.generateCacheKey(modelName, prompt, type);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Süresi dolmuş veya model versiyonu değişmişse null döndür
    if (
      Date.now() - entry.timestamp > this.CACHE_DURATION ||
      entry.modelVersion !== modelVersion
    ) {
      this.cache.delete(key);
      return null;
    }

    return entry.response;
  }

  public clear(): void {
    this.cache.clear();
  }

  public clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }

  public getStats(): {
    size: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    const entries = Array.from(this.cache.values());
    return {
      size: this.cache.size,
      oldestEntry: Math.min(...entries.map(e => e.timestamp)),
      newestEntry: Math.max(...entries.map(e => e.timestamp))
    };
  }
}
