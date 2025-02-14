import { AI_MODELS } from './models';

export class OpenSourceAI {
  private static instance: OpenSourceAI;
  private readonly STABILITY_API = 'https://api.stability.ai/v1';
  private readonly STABILITY_TOKEN: string;

  private readonly VIDEO_SETTINGS = {
    width: 576,
    height: 320,
    cfg_scale: 15,
    motion_bucket_id: 127,
    seed: Math.floor(Math.random() * 1000000)
  };

  private constructor() {
    this.STABILITY_TOKEN = import.meta.env.VITE_STABILITY_API_KEY || '';
    
    if (!this.STABILITY_TOKEN) {
      console.error('Stability AI API anahtarı bulunamadı. Lütfen .env.local dosyasını kontrol edin.');
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

      if (!this.STABILITY_TOKEN) {
        throw new Error('Stability AI API anahtarı bulunamadı');
      }

      const response = await fetch(`${this.STABILITY_API}/generation/text-to-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.STABILITY_TOKEN}`,
          'Accept': 'video/mp4'
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          ...this.VIDEO_SETTINGS
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Stability AI API hatası:', errorData);
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
