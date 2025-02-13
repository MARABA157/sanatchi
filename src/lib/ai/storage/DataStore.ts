interface StorageMetrics {
  totalSize: number;
  itemCount: number;
  lastOptimized: Date;
  compressionRatio: number;
}

interface StorageItem<T> {
  id: string;
  data: T;
  metadata: {
    created: Date;
    modified: Date;
    accessed: Date;
    size: number;
    type: string;
    tags: string[];
    version: number;
    checksum: string;
  };
}

export class DataStore {
  private static instance: DataStore;
  private storage: Map<string, StorageItem<any>> = new Map();
  private indices: Map<string, Map<string, Set<string>>> = new Map();
  private readonly MAX_STORAGE_SIZE = 1024 * 1024 * 1024; // 1GB
  private metrics: StorageMetrics;

  private constructor() {
    this.metrics = {
      totalSize: 0,
      itemCount: 0,
      lastOptimized: new Date(),
      compressionRatio: 1
    };

    // Periyodik optimizasyon
    setInterval(() => {
      this.optimizeStorage();
    }, 60 * 60 * 1000); // Her saat
  }

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  public async store<T>(
    data: T,
    type: string,
    tags: string[] = []
  ): Promise<string> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    // Veri boyutunu hesapla
    const size = this.calculateSize(data);
    
    // Depolama limitini kontrol et
    if (this.metrics.totalSize + size > this.MAX_STORAGE_SIZE) {
      await this.freeSpace(size);
    }

    const item: StorageItem<T> = {
      id,
      data,
      metadata: {
        created: now,
        modified: now,
        accessed: now,
        size,
        type,
        tags,
        version: 1,
        checksum: await this.calculateChecksum(data)
      }
    };

    // Veriyi depola
    this.storage.set(id, item);
    
    // İndeksleri güncelle
    this.updateIndices(item);
    
    // Metrikleri güncelle
    this.metrics.totalSize += size;
    this.metrics.itemCount++;

    return id;
  }

  public async retrieve<T>(id: string): Promise<T | null> {
    const item = this.storage.get(id) as StorageItem<T> | undefined;
    if (!item) return null;

    // Erişim zamanını güncelle
    item.metadata.accessed = new Date();
    
    // Veri bütünlüğünü kontrol et
    const currentChecksum = await this.calculateChecksum(item.data);
    if (currentChecksum !== item.metadata.checksum) {
      console.error(`Veri bütünlüğü hatası: ${id}`);
      return null;
    }

    return item.data;
  }

  public async update<T>(
    id: string,
    data: T,
    tags?: string[]
  ): Promise<boolean> {
    const item = this.storage.get(id) as StorageItem<T> | undefined;
    if (!item) return false;

    const now = new Date();
    const newSize = this.calculateSize(data);
    const sizeDiff = newSize - item.metadata.size;

    // Yeni boyut için yer kontrolü
    if (sizeDiff > 0 && this.metrics.totalSize + sizeDiff > this.MAX_STORAGE_SIZE) {
      await this.freeSpace(sizeDiff);
    }

    // Eski indeksleri kaldır
    this.removeFromIndices(item);

    // Metadatayı güncelle
    item.data = data;
    item.metadata.modified = now;
    item.metadata.accessed = now;
    item.metadata.size = newSize;
    item.metadata.version++;
    item.metadata.checksum = await this.calculateChecksum(data);
    if (tags) item.metadata.tags = tags;

    // Yeni indeksleri ekle
    this.updateIndices(item);

    // Metrikleri güncelle
    this.metrics.totalSize += sizeDiff;

    return true;
  }

  public delete(id: string): boolean {
    const item = this.storage.get(id);
    if (!item) return false;

    // İndekslerden kaldır
    this.removeFromIndices(item);

    // Depodan kaldır
    this.storage.delete(id);

    // Metrikleri güncelle
    this.metrics.totalSize -= item.metadata.size;
    this.metrics.itemCount--;

    return true;
  }

  public query(params: {
    type?: string;
    tags?: string[];
    createdAfter?: Date;
    modifiedAfter?: Date;
    minVersion?: number;
  }): string[] {
    let results = new Set<string>();
    let isFirstFilter = true;

    // Tür filtreleme
    if (params.type) {
      const typeIndex = this.indices.get('type')?.get(params.type) || new Set();
      results = new Set(typeIndex);
      isFirstFilter = false;
    }

    // Etiket filtreleme
    if (params.tags) {
      const tagResults = params.tags.map(tag => 
        this.indices.get('tag')?.get(tag) || new Set()
      );
      
      if (tagResults.length > 0) {
        const intersection = this.intersectSets(tagResults);
        results = isFirstFilter ? intersection : this.intersectSets([results, intersection]);
        isFirstFilter = false;
      }
    }

    // Diğer filtreler
    const candidates = isFirstFilter ? Array.from(this.storage.entries()) :
      Array.from(results).map(id => [id, this.storage.get(id)] as [string, StorageItem<any>]);

    return candidates
      .filter(([, item]) => {
        if (!item) return false;
        
        if (params.createdAfter && item.metadata.created < params.createdAfter) {
          return false;
        }
        
        if (params.modifiedAfter && item.metadata.modified < params.modifiedAfter) {
          return false;
        }
        
        if (params.minVersion && item.metadata.version < params.minVersion) {
          return false;
        }

        return true;
      })
      .map(([id]) => id);
  }

  private updateIndices(item: StorageItem<any>) {
    // Tür indeksi
    this.updateIndex('type', item.metadata.type, item.id);
    
    // Etiket indeksleri
    item.metadata.tags.forEach(tag => {
      this.updateIndex('tag', tag, item.id);
    });
  }

  private updateIndex(indexType: string, key: string, id: string) {
    if (!this.indices.has(indexType)) {
      this.indices.set(indexType, new Map());
    }
    
    const index = this.indices.get(indexType)!;
    if (!index.has(key)) {
      index.set(key, new Set());
    }
    
    index.get(key)!.add(id);
  }

  private removeFromIndices(item: StorageItem<any>) {
    // Tür indeksinden kaldır
    this.indices.get('type')?.get(item.metadata.type)?.delete(item.id);
    
    // Etiket indekslerinden kaldır
    item.metadata.tags.forEach(tag => {
      this.indices.get('tag')?.get(tag)?.delete(item.id);
    });
  }

  private intersectSets(sets: Set<string>[]): Set<string> {
    if (sets.length === 0) return new Set();
    
    const result = new Set(sets[0]);
    
    for (let i = 1; i < sets.length; i++) {
      for (const item of result) {
        if (!sets[i].has(item)) {
          result.delete(item);
        }
      }
    }
    
    return result;
  }

  private calculateSize(data: any): number {
    return new TextEncoder().encode(JSON.stringify(data)).length;
  }

  private async calculateChecksum(data: any): Promise<string> {
    const text = JSON.stringify(data);
    const buffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async freeSpace(requiredSize: number) {
    // En az kullanılan ve en eski öğeleri bul
    const items = Array.from(this.storage.values())
      .sort((a, b) => {
        // Erişim sıklığı ve zamanı bazlı sıralama
        const aScore = a.metadata.accessed.getTime() / 1000;
        const bScore = b.metadata.accessed.getTime() / 1000;
        return aScore - bScore;
      });

    let freedSpace = 0;
    for (const item of items) {
      if (freedSpace >= requiredSize) break;
      
      this.delete(item.id);
      freedSpace += item.metadata.size;
    }
  }

  private async optimizeStorage() {
    const now = new Date();
    let optimizedSize = 0;

    // Sıkıştırma ve optimize etme
    for (const [id, item] of this.storage.entries()) {
      // Veri bütünlüğünü kontrol et
      const currentChecksum = await this.calculateChecksum(item.data);
      if (currentChecksum !== item.metadata.checksum) {
        console.error(`Veri bütünlüğü hatası (${id}), öğe kaldırılıyor`);
        this.delete(id);
        continue;
      }

      // Veriyi optimize et
      const optimizedData = this.optimizeData(item.data);
      const newSize = this.calculateSize(optimizedData);
      
      if (newSize < item.metadata.size) {
        item.data = optimizedData;
        optimizedSize += (item.metadata.size - newSize);
        item.metadata.size = newSize;
      }
    }

    // Metrikleri güncelle
    this.metrics.lastOptimized = now;
    this.metrics.compressionRatio = optimizedSize / this.metrics.totalSize;
  }

  private optimizeData(data: any): any {
    // Temel veri optimizasyonu
    if (typeof data === 'string') {
      return data.trim();
    }
    
    if (Array.isArray(data)) {
      return data.filter(item => item != null);
    }
    
    if (typeof data === 'object' && data !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (value != null) {
          result[key] = this.optimizeData(value);
        }
      }
      return result;
    }
    
    return data;
  }

  public getMetrics(): StorageMetrics {
    return { ...this.metrics };
  }

  public getStorageInfo(id: string): {
    exists: boolean;
    metadata?: StorageItem<any>['metadata'];
  } {
    const item = this.storage.get(id);
    return item ? {
      exists: true,
      metadata: { ...item.metadata }
    } : {
      exists: false
    };
  }
}
