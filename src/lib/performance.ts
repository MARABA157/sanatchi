import { supabase } from './supabase';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

interface MemoryMetric {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
  timestamp: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private memoryMetrics: MemoryMetric[] = [];
  private maxMetrics: number = 1000;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public recordMetric(name: string, value: number): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);
    this.trimMetrics();
  }

  public recordMemoryMetric(): void {
    if (performance.memory) {
      const memory = performance.memory as {
        jsHeapSizeLimit: number;
        totalJSHeapSize: number;
        usedJSHeapSize: number;
      };

      const memoryMetric: MemoryMetric = {
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        totalJSHeapSize: memory.totalJSHeapSize,
        usedJSHeapSize: memory.usedJSHeapSize,
        timestamp: Date.now(),
      };

      this.memoryMetrics.push(memoryMetric);
      this.trimMemoryMetrics();
    }
  }

  public getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((metric) => metric.name === name);
    }
    return this.metrics;
  }

  public getMemoryMetrics(): MemoryMetric[] {
    return this.memoryMetrics;
  }

  public getAverageMetric(name: string): number | null {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return null;

    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  public clearMetrics(): void {
    this.metrics = [];
    this.memoryMetrics = [];
  }

  private trimMetrics(): void {
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  private trimMemoryMetrics(): void {
    if (this.memoryMetrics.length > this.maxMetrics) {
      this.memoryMetrics = this.memoryMetrics.slice(-this.maxMetrics);
    }
  }
}

// Export a singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility functions
export function measureAsyncOperation<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();

  return operation().finally(() => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    performanceMonitor.recordMetric(name, duration);
  });
}

export function measureSyncOperation<T>(
  name: string,
  operation: () => T
): T {
  const startTime = performance.now();

  try {
    return operation();
  } finally {
    const endTime = performance.now();
    const duration = endTime - startTime;
    performanceMonitor.recordMetric(name, duration);
  }
}

// Types for the performance API
declare global {
  interface Performance {
    memory?: {
      jsHeapSizeLimit: number;
      totalJSHeapSize: number;
      usedJSHeapSize: number;
    };
  }
}

// Method decorator for performance tracking
export function track() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      const result = await originalMethod.apply(this, args);
      const duration = performance.now() - start;

      performanceMonitor.recordMetric(propertyKey, duration);

      if (duration > 1000) {
        console.warn(`Slow operation: ${propertyKey} (${duration}ms)`);
      }

      return result;
    };

    return descriptor;
  };
}
