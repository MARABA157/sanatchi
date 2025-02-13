import { ModelType } from '../types';

interface MemoryEntry {
  id: string;
  type: 'concept' | 'experience' | 'pattern' | 'relationship';
  content: any;
  associations: string[];
  importance: number;
  lastAccessed: Date;
  accessCount: number;
  confidence: number;
  created: Date;
  modified: Date;
}

export class LongTermMemory {
  private static instance: LongTermMemory;
  private memories: Map<string, MemoryEntry> = new Map();
  private associations: Map<string, Set<string>> = new Map();
  private readonly MEMORY_LIMIT = 10000;

  private constructor() {
    this.initializeMemorySystem();
  }

  public static getInstance(): LongTermMemory {
    if (!LongTermMemory.instance) {
      LongTermMemory.instance = new LongTermMemory();
    }
    return LongTermMemory.instance;
  }

  private initializeMemorySystem() {
    // Temel sanat konseptlerini yükle
    this.addMemory({
      type: 'concept',
      content: {
        name: 'Sanat Akımları',
        description: 'Sanat tarihindeki önemli akımlar',
        examples: ['empresyonizm', 'kübizm', 'sürrealizm']
      },
      associations: ['sanat', 'tarih', 'stil'],
      importance: 0.9
    });

    // Periyodik bellek temizleme ve optimize etme
    setInterval(() => {
      this.optimizeMemories();
    }, 24 * 60 * 60 * 1000); // 24 saat
  }

  public addMemory(params: {
    type: MemoryEntry['type'];
    content: any;
    associations: string[];
    importance: number;
  }): string {
    const id = crypto.randomUUID();
    const now = new Date();

    const memory: MemoryEntry = {
      id,
      type: params.type,
      content: params.content,
      associations: params.associations,
      importance: params.importance,
      lastAccessed: now,
      accessCount: 0,
      confidence: 0.8,
      created: now,
      modified: now
    };

    // Bellek limitini kontrol et
    if (this.memories.size >= this.MEMORY_LIMIT) {
      this.forgetLeastImportant();
    }

    this.memories.set(id, memory);
    this.updateAssociations(memory);

    return id;
  }

  private updateAssociations(memory: MemoryEntry) {
    memory.associations.forEach(tag => {
      if (!this.associations.has(tag)) {
        this.associations.set(tag, new Set());
      }
      this.associations.get(tag)?.add(memory.id);
    });
  }

  public recall(query: string, context?: string[]): MemoryEntry[] {
    const now = new Date();
    const results: [MemoryEntry, number][] = [];

    // İlgili bellekleri bul
    this.memories.forEach(memory => {
      const relevance = this.calculateRelevance(memory, query, context);
      if (relevance > 0.3) { // Eşik değeri
        results.push([memory, relevance]);
        
        // Erişim metriklerini güncelle
        memory.lastAccessed = now;
        memory.accessCount++;
      }
    });

    // Sonuçları alaka düzeyine göre sırala
    return results
      .sort(([, a], [, b]) => b - a)
      .map(([memory]) => memory)
      .slice(0, 10); // En alakalı 10 sonuç
  }

  private calculateRelevance(
    memory: MemoryEntry,
    query: string,
    context?: string[]
  ): number {
    let relevance = 0;

    // İçerik benzerliği
    const contentRelevance = this.calculateContentSimilarity(memory.content, query);
    relevance += contentRelevance * 0.4;

    // Bağlam uyumu
    if (context) {
      const contextRelevance = this.calculateContextMatch(memory, context);
      relevance += contextRelevance * 0.3;
    }

    // Önem ve güven faktörü
    relevance += (memory.importance * memory.confidence) * 0.2;

    // Yakınlık zamanı faktörü
    const recency = this.calculateRecency(memory.lastAccessed);
    relevance += recency * 0.1;

    return relevance;
  }

  private calculateContentSimilarity(content: any, query: string): number {
    // Basit kelime eşleştirme
    const contentStr = JSON.stringify(content).toLowerCase();
    const queryWords = query.toLowerCase().split(' ');
    
    let matches = 0;
    queryWords.forEach(word => {
      if (contentStr.includes(word)) matches++;
    });

    return matches / queryWords.length;
  }

  private calculateContextMatch(memory: MemoryEntry, context: string[]): number {
    const matchingTags = memory.associations.filter(tag => 
      context.includes(tag)
    ).length;

    return matchingTags / Math.max(memory.associations.length, context.length);
  }

  private calculateRecency(lastAccessed: Date): number {
    const hoursSinceAccess = (Date.now() - lastAccessed.getTime()) / (1000 * 60 * 60);
    return Math.exp(-hoursSinceAccess / 720); // 30 gün yarı ömür
  }

  private forgetLeastImportant() {
    let leastImportantId = '';
    let lowestScore = Infinity;

    this.memories.forEach((memory, id) => {
      const score = 
        memory.importance * 0.4 +
        memory.confidence * 0.3 +
        (memory.accessCount / 100) * 0.2 +
        this.calculateRecency(memory.lastAccessed) * 0.1;

      if (score < lowestScore) {
        lowestScore = score;
        leastImportantId = id;
      }
    });

    if (leastImportantId) {
      this.removeMemory(leastImportantId);
    }
  }

  private removeMemory(id: string) {
    const memory = this.memories.get(id);
    if (!memory) return;

    // İlişkileri temizle
    memory.associations.forEach(tag => {
      this.associations.get(tag)?.delete(id);
      if (this.associations.get(tag)?.size === 0) {
        this.associations.delete(tag);
      }
    });

    this.memories.delete(id);
  }

  private optimizeMemories() {
    // Önem skorlarını güncelle
    this.memories.forEach(memory => {
      memory.importance = this.recalculateImportance(memory);
      memory.confidence = this.recalculateConfidence(memory);
    });

    // Gereksiz bellekleri temizle
    this.cleanupMemories();
  }

  private recalculateImportance(memory: MemoryEntry): number {
    const accessFrequency = memory.accessCount / 
      ((Date.now() - memory.created.getTime()) / (1000 * 60 * 60 * 24));
    
    const associationStrength = this.calculateAssociationStrength(memory);
    
    return (
      memory.importance * 0.4 +
      accessFrequency * 0.3 +
      associationStrength * 0.3
    );
  }

  private recalculateConfidence(memory: MemoryEntry): number {
    // Güven skorunu güncelle
    const timeFactor = Math.exp(
      -(Date.now() - memory.modified.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    return Math.max(0.5, memory.confidence * timeFactor);
  }

  private calculateAssociationStrength(memory: MemoryEntry): number {
    let totalConnections = 0;

    memory.associations.forEach(tag => {
      const connectedMemories = this.associations.get(tag)?.size || 0;
      totalConnections += connectedMemories;
    });

    return Math.min(1, totalConnections / (10 * memory.associations.length));
  }

  private cleanupMemories() {
    const now = Date.now();
    const threshold = 0.2; // Minimum önem eşiği

    this.memories.forEach((memory, id) => {
      const age = (now - memory.created.getTime()) / (1000 * 60 * 60 * 24);
      const importance = memory.importance;
      const confidence = memory.confidence;

      if (
        (age > 90 && importance < threshold) || // 90 günden eski ve önemsiz
        (confidence < 0.3) || // Düşük güven
        (age > 180 && memory.accessCount === 0) // 6 aydır hiç kullanılmamış
      ) {
        this.removeMemory(id);
      }
    });
  }

  // İstatistikler ve analiz
  public getMemoryStats(): {
    totalMemories: number;
    averageImportance: number;
    averageConfidence: number;
    memoryTypeDistribution: Record<MemoryEntry['type'], number>;
  } {
    let totalImportance = 0;
    let totalConfidence = 0;
    const typeCount: Record<MemoryEntry['type'], number> = {
      concept: 0,
      experience: 0,
      pattern: 0,
      relationship: 0
    };

    this.memories.forEach(memory => {
      totalImportance += memory.importance;
      totalConfidence += memory.confidence;
      typeCount[memory.type]++;
    });

    const totalMemories = this.memories.size;

    return {
      totalMemories,
      averageImportance: totalMemories > 0 ? totalImportance / totalMemories : 0,
      averageConfidence: totalMemories > 0 ? totalConfidence / totalMemories : 0,
      memoryTypeDistribution: typeCount
    };
  }
}
