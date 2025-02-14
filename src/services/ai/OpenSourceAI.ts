import { AI_MODELS } from './models';

export class OpenSourceAI {
  private static instance: OpenSourceAI;
  private readonly HF_API = 'https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b';
  private readonly HF_TOKEN: string;

  private constructor() {
    this.HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
    
    if (!this.HF_TOKEN) {
      console.error('HuggingFace API anahtarı bulunamadı. Lütfen .env.local dosyasını kontrol edin.');
    }
  }

  public static getInstance(): OpenSourceAI {
    if (!OpenSourceAI.instance) {
      OpenSourceAI.instance = new OpenSourceAI();
    }
    return OpenSourceAI.instance;
  }

  // Video oluşturma
  public async generateVideo(prompt: string): Promise<{ url: string }> {
    try {
      console.log('Video oluşturuluyor:', prompt);

      if (!this.HF_TOKEN) {
        throw new Error('HuggingFace API anahtarı bulunamadı');
      }

      const response = await fetch(this.HF_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.HF_TOKEN}`,
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_frames: 16,
            num_inference_steps: 50
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('HuggingFace API hatası:', errorData);
        throw new Error(`Video oluşturma hatası: ${response.status} - ${errorData || response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      return { url };
    } catch (error) {
      console.error('Video oluşturma hatası:', error);
      if (error instanceof Error) {
        throw new Error(`Video oluşturma hatası: ${error.message}`);
      } else {
        throw new Error('Bilinmeyen bir video oluşturma hatası oluştu');
      }
    }
  }
}
