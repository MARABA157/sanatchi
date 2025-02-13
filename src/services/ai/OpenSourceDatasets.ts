import axios from 'axios';

interface Dataset {
  conversationData: any[];
  artworkData: any[];
  videoData: any[];
}

export class OpenSourceDatasets {
  private static readonly DATASETS = {
    conversation: [
      'https://huggingface.co/datasets/daily_dialog',  // Günlük konuşma veri seti
      'https://huggingface.co/datasets/wikihow',       // Eğitici içerik veri seti
      'https://huggingface.co/datasets/art_conversations' // Sanat hakkında konuşmalar
    ],
    artwork: [
      'https://huggingface.co/datasets/wikiart',        // WikiArt veri seti
      'https://huggingface.co/datasets/behance_photos', // Behance portföy veri seti
      'https://huggingface.co/datasets/art_history'     // Sanat tarihi veri seti
    ],
    video: [
      'https://huggingface.co/datasets/ucf101',         // UCF101 video veri seti
      'https://huggingface.co/datasets/webvid',         // WebVid video veri seti
      'https://huggingface.co/datasets/art_videos'      // Sanat videoları veri seti
    ]
  };

  public static async loadDatasets(): Promise<Dataset> {
    try {
      // Veri setlerini paralel olarak yükle
      const [conversationData, artworkData, videoData] = await Promise.all([
        this.loadConversationData(),
        this.loadArtworkData(),
        this.loadVideoData()
      ]);

      return {
        conversationData,
        artworkData,
        videoData
      };
    } catch (error) {
      console.error('Error loading datasets:', error);
      throw error;
    }
  }

  private static async loadConversationData(): Promise<any[]> {
    const data = [];
    for (const url of this.DATASETS.conversation) {
      try {
        const response = await axios.get(url);
        data.push(...this.preprocessConversationData(response.data));
      } catch (error) {
        console.error(`Error loading conversation dataset from ${url}:`, error);
      }
    }
    return data;
  }

  private static async loadArtworkData(): Promise<any[]> {
    const data = [];
    for (const url of this.DATASETS.artwork) {
      try {
        const response = await axios.get(url);
        data.push(...this.preprocessArtworkData(response.data));
      } catch (error) {
        console.error(`Error loading artwork dataset from ${url}:`, error);
      }
    }
    return data;
  }

  private static async loadVideoData(): Promise<any[]> {
    const data = [];
    for (const url of this.DATASETS.video) {
      try {
        const response = await axios.get(url);
        data.push(...this.preprocessVideoData(response.data));
      } catch (error) {
        console.error(`Error loading video dataset from ${url}:`, error);
      }
    }
    return data;
  }

  private static preprocessConversationData(data: any[]): any[] {
    return data.map(item => ({
      input: item.question || item.prompt,
      output: item.response || item.answer,
      context: item.context || '',
      category: item.category || 'general'
    }));
  }

  private static preprocessArtworkData(data: any[]): any[] {
    return data.map(item => ({
      image: item.image_url || item.url,
      title: item.title || '',
      description: item.description || '',
      style: item.style || '',
      artist: item.artist || '',
      year: item.year || ''
    }));
  }

  private static preprocessVideoData(data: any[]): any[] {
    return data.map(item => ({
      video: item.video_url || item.url,
      title: item.title || '',
      description: item.description || '',
      category: item.category || '',
      duration: item.duration || 0,
      frames: item.frames || []
    }));
  }
}
