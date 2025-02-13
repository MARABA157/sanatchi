import { LongTermMemory } from '../memory/LongTermMemory';

interface ThoughtNode {
  id: string;
  content: string;
  type: 'observation' | 'analysis' | 'hypothesis' | 'conclusion';
  confidence: number;
  evidence: string[];
  children: string[];
  parent?: string;
  created: Date;
}

interface ThoughtChain {
  id: string;
  topic: string;
  nodes: Map<string, ThoughtNode>;
  rootNode: string;
  status: 'active' | 'completed' | 'abandoned';
  created: Date;
  modified: Date;
}

export class DeepThinking {
  private static instance: DeepThinking;
  private memory: LongTermMemory;
  private thoughts: Map<string, ThoughtChain> = new Map();
  private readonly MAX_CHAIN_DEPTH = 10;
  private readonly MIN_CONFIDENCE = 0.7;

  private constructor() {
    this.memory = LongTermMemory.getInstance();
  }

  public static getInstance(): DeepThinking {
    if (!DeepThinking.instance) {
      DeepThinking.instance = new DeepThinking();
    }
    return DeepThinking.instance;
  }

  public startThoughtChain(topic: string, initialObservation: string): string {
    const chainId = crypto.randomUUID();
    const rootNodeId = crypto.randomUUID();
    const now = new Date();

    const rootNode: ThoughtNode = {
      id: rootNodeId,
      content: initialObservation,
      type: 'observation',
      confidence: 1,
      evidence: [],
      children: [],
      created: now
    };

    const chain: ThoughtChain = {
      id: chainId,
      topic,
      nodes: new Map([[rootNodeId, rootNode]]),
      rootNode: rootNodeId,
      status: 'active',
      created: now,
      modified: now
    };

    this.thoughts.set(chainId, chain);
    return chainId;
  }

  public async think(chainId: string): Promise<ThoughtNode[]> {
    const chain = this.thoughts.get(chainId);
    if (!chain || chain.status !== 'active') return [];

    const thoughts: ThoughtNode[] = [];
    const processedNodes = new Set<string>();
    let currentDepth = 0;

    const processNode = async (nodeId: string) => {
      if (
        processedNodes.has(nodeId) ||
        currentDepth >= this.MAX_CHAIN_DEPTH
      ) return;

      const node = chain.nodes.get(nodeId);
      if (!node) return;

      processedNodes.add(nodeId);
      currentDepth++;

      // Mevcut düşünceyi analiz et
      const analysis = await this.analyzeThought(node, chain);
      if (analysis) {
        thoughts.push(analysis);
        chain.nodes.set(analysis.id, analysis);
        node.children.push(analysis.id);
      }

      // Hipotez oluştur
      const hypothesis = await this.generateHypothesis(analysis || node, chain);
      if (hypothesis) {
        thoughts.push(hypothesis);
        chain.nodes.set(hypothesis.id, hypothesis);
        node.children.push(hypothesis.id);
      }

      // Alt düşünceleri işle
      for (const childId of node.children) {
        await processNode(childId);
      }

      currentDepth--;
    };

    await processNode(chain.rootNode);
    
    // Sonuçları değerlendir
    const conclusion = this.drawConclusion(chain);
    if (conclusion) {
      thoughts.push(conclusion);
      chain.nodes.set(conclusion.id, conclusion);
    }

    chain.modified = new Date();
    return thoughts;
  }

  private async analyzeThought(
    node: ThoughtNode,
    chain: ThoughtChain
  ): Promise<ThoughtNode | null> {
    // Belleği kullanarak analiz yap
    const memories = this.memory.recall(node.content, [chain.topic]);
    if (memories.length === 0) return null;

    const relevantPoints = memories
      .map(m => m.content)
      .filter(content => this.isRelevant(content, node.content));

    if (relevantPoints.length === 0) return null;

    const analysisContent = this.synthesizeContent(
      relevantPoints,
      'Bu gözlem şu açılardan önemli: '
    );

    return {
      id: crypto.randomUUID(),
      content: analysisContent,
      type: 'analysis',
      confidence: this.calculateConfidence(relevantPoints.length, memories.length),
      evidence: memories.map(m => m.id),
      children: [],
      parent: node.id,
      created: new Date()
    };
  }

  private async generateHypothesis(
    node: ThoughtNode,
    chain: ThoughtChain
  ): Promise<ThoughtNode | null> {
    if (node.confidence < this.MIN_CONFIDENCE) return null;

    // İlgili bellekleri getir
    const memories = this.memory.recall(node.content, [chain.topic]);
    
    // Benzer durumları analiz et
    const patterns = this.findPatterns(memories);
    if (patterns.length === 0) return null;

    const hypothesisContent = this.synthesizeContent(
      patterns,
      'Bu analiz bize şunu gösteriyor: '
    );

    return {
      id: crypto.randomUUID(),
      content: hypothesisContent,
      type: 'hypothesis',
      confidence: this.calculateConfidence(patterns.length, memories.length),
      evidence: memories.map(m => m.id),
      children: [],
      parent: node.id,
      created: new Date()
    };
  }

  private drawConclusion(chain: ThoughtChain): ThoughtNode | null {
    const nodes = Array.from(chain.nodes.values());
    const hypotheses = nodes.filter(n => n.type === 'hypothesis');
    
    if (hypotheses.length === 0) return null;

    // En güvenilir hipotezleri seç
    const reliableHypotheses = hypotheses
      .filter(h => h.confidence >= this.MIN_CONFIDENCE)
      .sort((a, b) => b.confidence - a.confidence);

    if (reliableHypotheses.length === 0) return null;

    const conclusionContent = this.synthesizeContent(
      reliableHypotheses.map(h => h.content),
      'Sonuç olarak: '
    );

    return {
      id: crypto.randomUUID(),
      content: conclusionContent,
      type: 'conclusion',
      confidence: this.calculateAverageConfidence(reliableHypotheses),
      evidence: reliableHypotheses.map(h => h.id),
      children: [],
      created: new Date()
    };
  }

  private isRelevant(content: any, context: string): boolean {
    // Basit alaka düzeyi kontrolü
    const contentStr = JSON.stringify(content).toLowerCase();
    const contextWords = context.toLowerCase().split(' ');
    
    return contextWords.some(word => 
      word.length > 3 && contentStr.includes(word)
    );
  }

  private findPatterns(memories: any[]): string[] {
    // Basit örüntü analizi
    const patterns: string[] = [];
    const contentMap = new Map<string, number>();

    memories.forEach(memory => {
      const content = JSON.stringify(memory.content);
      contentMap.set(content, (contentMap.get(content) || 0) + 1);
    });

    contentMap.forEach((count, content) => {
      if (count >= 2) { // En az 2 kez tekrar eden örüntüler
        patterns.push(JSON.parse(content));
      }
    });

    return patterns;
  }

  private synthesizeContent(points: any[], prefix: string): string {
    // İçeriği birleştir
    return prefix + points
      .map(p => typeof p === 'string' ? p : JSON.stringify(p))
      .join('. ');
  }

  private calculateConfidence(matches: number, total: number): number {
    return Math.min(1, Math.max(0.1, matches / total));
  }

  private calculateAverageConfidence(nodes: ThoughtNode[]): number {
    return nodes.reduce((acc, node) => acc + node.confidence, 0) / nodes.length;
  }

  // Düşünce zinciri yönetimi
  public getThoughtChain(chainId: string): ThoughtChain | null {
    return this.thoughts.get(chainId) || null;
  }

  public getAllThoughtChains(): ThoughtChain[] {
    return Array.from(this.thoughts.values());
  }

  public getActiveThoughtChains(): ThoughtChain[] {
    return Array.from(this.thoughts.values())
      .filter(chain => chain.status === 'active');
  }

  public completeThoughtChain(chainId: string): void {
    const chain = this.thoughts.get(chainId);
    if (chain) {
      chain.status = 'completed';
      chain.modified = new Date();
    }
  }

  public abandonThoughtChain(chainId: string): void {
    const chain = this.thoughts.get(chainId);
    if (chain) {
      chain.status = 'abandoned';
      chain.modified = new Date();
    }
  }
}
