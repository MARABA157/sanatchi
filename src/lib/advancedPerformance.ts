interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
  errors: string[];
}

interface PerformanceConfig {
  sampleSize?: number;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  enableMemoryTracking?: boolean;
  networkTimeout?: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private config: Required<PerformanceConfig>;
  private startTime: number;
  private static instance: PerformanceMonitor;

  private constructor(config: PerformanceConfig = {}) {
    this.config = {
      sampleSize: config.sampleSize ?? 100,
      logLevel: config.logLevel ?? 'info',
      enableMemoryTracking: config.enableMemoryTracking ?? true,
      networkTimeout: config.networkTimeout ?? 5000,
    };

    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      networkRequests: 0,
      errors: [],
    };

    this.startTime = performance.now();
  }

  public static getInstance(config?: PerformanceConfig): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(config);
    }
    return PerformanceMonitor.instance;
  }

  public startMeasurement(): void {
    this.startTime = performance.now();
  }

  public endMeasurement(label: string): number {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    
    if (this.config.logLevel === 'debug') {
      console.debug(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  public trackNetworkRequest(): void {
    this.metrics.networkRequests++;
  }

  public trackError(error: Error): void {
    this.metrics.errors.push(error.message);
    
    if (this.config.logLevel === 'error') {
      console.error('[Performance Error]', error);
    }
  }

  public getMetrics(): PerformanceMetrics {
    if (this.config.enableMemoryTracking) {
      this.updateMemoryUsage();
    }
    return { ...this.metrics };
  }

  private updateMemoryUsage(): void {
    if (performance.memory) {
      this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
    }
  }

  public async measureAsyncOperation<T>(
    operation: () => Promise<T>,
    label: string
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Operation ${label} timed out`));
          }, this.config.networkTimeout);
        }),
      ]);

      const duration = performance.now() - start;
      
      if (this.config.logLevel === 'info') {
        console.info(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      this.trackError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  public clearMetrics(): void {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      networkRequests: 0,
      errors: [],
    };
    this.startTime = performance.now();
  }
}

// Performance monitoring hooks
export function usePerformanceMonitoring(config?: PerformanceConfig) {
  const monitor = PerformanceMonitor.getInstance(config);

  return {
    startMeasurement: () => monitor.startMeasurement(),
    endMeasurement: (label: string) => monitor.endMeasurement(label),
    trackNetworkRequest: () => monitor.trackNetworkRequest(),
    trackError: (error: Error) => monitor.trackError(error),
    getMetrics: () => monitor.getMetrics(),
    clearMetrics: () => monitor.clearMetrics(),
    measureAsyncOperation: <T>(operation: () => Promise<T>, label: string) =>
      monitor.measureAsyncOperation(operation, label),
  };
}

// Type declaration for performance.memory
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}
