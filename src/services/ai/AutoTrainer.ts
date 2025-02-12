import { supabase } from '@/lib/supabase';
import { HuggingFaceAPI } from './HuggingFaceAPI';
import { OpenSourceDatasets } from './OpenSourceDatasets';

interface TrainingMetrics {
  accuracy: number;
  loss: number;
  epochNumber: number;
}

export class AutoTrainer {
  private static instance: AutoTrainer;
  private isTraining: boolean = false;
  private trainingInterval: number = 24 * 60 * 60 * 1000; // 24 saat

  private constructor() {
    this.initializeAutoTraining();
  }

  public static getInstance(): AutoTrainer {
    if (!AutoTrainer.instance) {
      AutoTrainer.instance = new AutoTrainer();
    }
    return AutoTrainer.instance;
  }

  private async initializeAutoTraining() {
    // Her 24 saatte bir eğitim kontrolü yap
    setInterval(async () => {
      await this.checkAndTrain();
    }, this.trainingInterval);
  }

  private async checkAndTrain() {
    if (this.isTraining) return;

    try {
      this.isTraining = true;
      
      // Son eğitim zamanını kontrol et
      const { data: lastTraining } = await supabase
        .from('ai_training_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      const shouldTrain = !lastTraining?.length || 
        (Date.now() - new Date(lastTraining[0].created_at).getTime() > this.trainingInterval);

      if (shouldTrain) {
        await this.trainAllModels();
      }
    } catch (error) {
      console.error('Training check failed:', error);
    } finally {
      this.isTraining = false;
    }
  }

  private async trainAllModels() {
    // Açık kaynak veri setlerini yükle
    const datasets = await OpenSourceDatasets.loadDatasets();
    
    // Her model için eğitim yap
    await Promise.all([
      this.trainChatModel(datasets.conversationData),
      this.trainArtModel(datasets.artworkData),
      this.trainVideoModel(datasets.videoData)
    ]);
  }

  private async trainChatModel(conversationData: any[]) {
    const metrics = await HuggingFaceAPI.fineTune({
      model: 'gpt2',
      dataset: conversationData,
      params: {
        epochs: 3,
        batchSize: 16,
        learningRate: 2e-5
      }
    });

    await this.logTraining('chat', metrics);
  }

  private async trainArtModel(artworkData: any[]) {
    const metrics = await HuggingFaceAPI.fineTune({
      model: 'stable-diffusion-v1-5',
      dataset: artworkData,
      params: {
        epochs: 5,
        batchSize: 4,
        learningRate: 1e-5
      }
    });

    await this.logTraining('art', metrics);
  }

  private async trainVideoModel(videoData: any[]) {
    const metrics = await HuggingFaceAPI.fineTune({
      model: 'modelscope-damo-text-to-video-synthesis',
      dataset: videoData,
      params: {
        epochs: 2,
        batchSize: 2,
        learningRate: 5e-6
      }
    });

    await this.logTraining('video', metrics);
  }

  private async logTraining(modelType: string, metrics: TrainingMetrics) {
    await supabase.from('ai_training_logs').insert([
      {
        model_type: modelType,
        accuracy: metrics.accuracy,
        loss: metrics.loss,
        epoch_number: metrics.epochNumber,
        created_at: new Date().toISOString()
      }
    ]);
  }

  // Public API
  public async getTrainingStatus(): Promise<any> {
    const { data } = await supabase
      .from('ai_training_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    return data;
  }

  public async forceTraining(): Promise<void> {
    if (!this.isTraining) {
      await this.checkAndTrain();
    }
  }
}
