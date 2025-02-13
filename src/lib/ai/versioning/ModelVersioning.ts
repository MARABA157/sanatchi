import { ModelType, ModelMetrics } from '../types';

interface Version {
  id: string;
  timestamp: Date;
  metrics: ModelMetrics;
  changes: string[];
  parentVersion: string | null;
}

interface ModelVersion {
  modelName: string;
  versions: Map<string, Version>;
  currentVersion: string;
}

export class ModelVersioning {
  private static instance: ModelVersioning;
  private models: Map<string, ModelVersion> = new Map();

  private constructor() {}

  public static getInstance(): ModelVersioning {
    if (!ModelVersioning.instance) {
      ModelVersioning.instance = new ModelVersioning();
    }
    return ModelVersioning.instance;
  }

  public initializeModel(modelName: string) {
    if (!this.models.has(modelName)) {
      const initialVersion = {
        id: 'v1.0.0',
        timestamp: new Date(),
        metrics: {
          accuracy: 0.8,
          usage: 0,
          lastUpdated: new Date()
        },
        changes: ['Initial version'],
        parentVersion: null
      };

      this.models.set(modelName, {
        modelName,
        versions: new Map([[initialVersion.id, initialVersion]]),
        currentVersion: initialVersion.id
      });
    }
  }

  public createNewVersion(
    modelName: string,
    metrics: ModelMetrics,
    changes: string[]
  ): string {
    const model = this.models.get(modelName);
    if (!model) {
      throw new Error(`Model bulunamadı: ${modelName}`);
    }

    const currentVersion = model.versions.get(model.currentVersion);
    if (!currentVersion) {
      throw new Error(`Geçerli versiyon bulunamadı: ${model.currentVersion}`);
    }

    // Yeni versiyon numarası oluştur
    const newVersionId = this.generateNextVersion(model.currentVersion);

    // Yeni versiyonu kaydet
    const newVersion: Version = {
      id: newVersionId,
      timestamp: new Date(),
      metrics,
      changes,
      parentVersion: model.currentVersion
    };

    model.versions.set(newVersionId, newVersion);
    model.currentVersion = newVersionId;

    return newVersionId;
  }

  private generateNextVersion(currentVersion: string): string {
    const [major, minor, patch] = currentVersion.substring(1).split('.').map(Number);
    
    // Metrik değişimine göre versiyon artırımı
    if (this.isBreakingChange()) {
      return `v${major + 1}.0.0`;
    } else if (this.isFeatureChange()) {
      return `v${major}.${minor + 1}.0`;
    } else {
      return `v${major}.${minor}.${patch + 1}`;
    }
  }

  private isBreakingChange(): boolean {
    // Major versiyon değişimi gerektiren durumları kontrol et
    return Math.random() < 0.1; // Örnek olarak %10 ihtimalle
  }

  private isFeatureChange(): boolean {
    // Minor versiyon değişimi gerektiren durumları kontrol et
    return Math.random() < 0.3; // Örnek olarak %30 ihtimalle
  }

  public getCurrentVersion(modelName: string): Version | null {
    const model = this.models.get(modelName);
    if (!model) return null;

    return model.versions.get(model.currentVersion) || null;
  }

  public getVersionHistory(modelName: string): Version[] {
    const model = this.models.get(modelName);
    if (!model) return [];

    return Array.from(model.versions.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public switchVersion(modelName: string, versionId: string): boolean {
    const model = this.models.get(modelName);
    if (!model || !model.versions.has(versionId)) return false;

    model.currentVersion = versionId;
    return true;
  }

  public compareVersions(
    modelName: string,
    versionA: string,
    versionB: string
  ): {
    accuracyDiff: number;
    usageDiff: number;
    changes: string[];
  } | null {
    const model = this.models.get(modelName);
    if (!model) return null;

    const vA = model.versions.get(versionA);
    const vB = model.versions.get(versionB);
    if (!vA || !vB) return null;

    return {
      accuracyDiff: vB.metrics.accuracy - vA.metrics.accuracy,
      usageDiff: vB.metrics.usage - vA.metrics.usage,
      changes: this.getChangesBetweenVersions(model, versionA, versionB)
    };
  }

  private getChangesBetweenVersions(
    model: ModelVersion,
    fromVersion: string,
    toVersion: string
  ): string[] {
    const changes: string[] = [];
    let currentVersion = toVersion;

    while (currentVersion !== fromVersion) {
      const version = model.versions.get(currentVersion);
      if (!version) break;

      changes.push(...version.changes);
      if (!version.parentVersion) break;
      currentVersion = version.parentVersion;
    }

    return changes.reverse();
  }

  public getVersionMetrics(modelName: string, versionId: string): ModelMetrics | null {
    const model = this.models.get(modelName);
    if (!model) return null;

    const version = model.versions.get(versionId);
    return version ? version.metrics : null;
  }

  public getAllModelVersions(): Map<string, string[]> {
    const versions = new Map<string, string[]>();
    
    for (const [modelName, model] of this.models.entries()) {
      versions.set(
        modelName,
        Array.from(model.versions.keys()).sort()
      );
    }

    return versions;
  }
}
