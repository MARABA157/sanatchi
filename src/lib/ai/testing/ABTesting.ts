import { ModelType, ModelMetrics } from '../types';

interface TestVariant {
  id: string;
  modelVersion: string;
  metrics: ModelMetrics;
  trafficPercentage: number;
  startDate: Date;
  endDate?: Date;
}

interface TestResult {
  variantId: string;
  metrics: ModelMetrics;
  sampleSize: number;
  confidence: number;
}

export class ABTesting {
  private static instance: ABTesting;
  private tests: Map<string, Map<string, TestVariant>> = new Map();
  private results: Map<string, TestResult[]> = new Map();

  private constructor() {}

  public static getInstance(): ABTesting {
    if (!ABTesting.instance) {
      ABTesting.instance = new ABTesting();
    }
    return ABTesting.instance;
  }

  public createTest(
    modelName: string,
    variants: {
      modelVersion: string;
      trafficPercentage: number;
    }[]
  ): string {
    // Test ID oluştur
    const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Varyantları oluştur
    const testVariants = new Map<string, TestVariant>();
    
    variants.forEach((variant, index) => {
      const variantId = `variant_${index}`;
      testVariants.set(variantId, {
        id: variantId,
        modelVersion: variant.modelVersion,
        metrics: {
          accuracy: 0,
          usage: 0,
          lastUpdated: new Date()
        },
        trafficPercentage: variant.trafficPercentage,
        startDate: new Date()
      });
    });

    this.tests.set(testId, testVariants);
    return testId;
  }

  public assignVariant(testId: string): string | null {
    const variants = this.tests.get(testId);
    if (!variants) return null;

    // Trafik yüzdelerine göre varyant seç
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const [variantId, variant] of variants.entries()) {
      cumulative += variant.trafficPercentage;
      if (random <= cumulative) {
        return variantId;
      }
    }

    return Array.from(variants.keys())[0];
  }

  public recordMetrics(
    testId: string,
    variantId: string,
    metrics: Partial<ModelMetrics>
  ): void {
    const variants = this.tests.get(testId);
    if (!variants || !variants.has(variantId)) return;

    const variant = variants.get(variantId)!;
    
    // Metrikleri güncelle
    variant.metrics = {
      accuracy: metrics.accuracy ?? variant.metrics.accuracy,
      usage: (variant.metrics.usage || 0) + 1,
      lastUpdated: new Date()
    };
  }

  public endTest(testId: string): TestResult[] {
    const variants = this.tests.get(testId);
    if (!variants) return [];

    const results: TestResult[] = [];

    for (const variant of variants.values()) {
      variant.endDate = new Date();
      
      // Test sonuçlarını hesapla
      const result = this.calculateTestResults(variant);
      results.push(result);
    }

    this.results.set(testId, results);
    return results;
  }

  private calculateTestResults(variant: TestVariant): TestResult {
    const sampleSize = variant.metrics.usage;
    const confidence = this.calculateConfidence(variant.metrics.accuracy, sampleSize);

    return {
      variantId: variant.id,
      metrics: variant.metrics,
      sampleSize,
      confidence
    };
  }

  private calculateConfidence(accuracy: number, sampleSize: number): number {
    // Basit bir güven aralığı hesaplaması
    const z = 1.96; // %95 güven aralığı için z-skoru
    const marginOfError = z * Math.sqrt((accuracy * (1 - accuracy)) / sampleSize);
    return Math.min(1, Math.max(0, 1 - marginOfError));
  }

  public getTestResults(testId: string): TestResult[] {
    return this.results.get(testId) || [];
  }

  public getActiveTests(): string[] {
    return Array.from(this.tests.keys()).filter(testId => {
      const variants = this.tests.get(testId);
      return variants && Array.from(variants.values()).some(v => !v.endDate);
    });
  }

  public getTestMetrics(testId: string): {
    totalSamples: number;
    averageAccuracy: number;
    bestVariant: string;
  } | null {
    const variants = this.tests.get(testId);
    if (!variants) return null;

    let totalSamples = 0;
    let totalAccuracy = 0;
    let bestVariant = '';
    let bestAccuracy = -1;

    for (const [variantId, variant] of variants.entries()) {
      totalSamples += variant.metrics.usage;
      totalAccuracy += variant.metrics.accuracy * variant.metrics.usage;

      if (variant.metrics.accuracy > bestAccuracy) {
        bestAccuracy = variant.metrics.accuracy;
        bestVariant = variantId;
      }
    }

    return {
      totalSamples,
      averageAccuracy: totalSamples > 0 ? totalAccuracy / totalSamples : 0,
      bestVariant
    };
  }

  public getTestVariants(testId: string): TestVariant[] {
    const variants = this.tests.get(testId);
    return variants ? Array.from(variants.values()) : [];
  }
}
