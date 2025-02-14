import { AI_MODELS } from './models';

export class OpenSourceAI {
  private static instance: OpenSourceAI;
  private readonly HF_API = 'https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b';
  private readonly HF_TOKEN: string;
  private readonly RUNWAY_API = 'https://api.runwayml.com/v1';
  private readonly RUNWAY_TOKEN: string;

  private constructor() {
    this.HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
    this.RUNWAY_TOKEN = import.meta.env.VITE_RUNWAY_API_KEY || '';
    
    if (!this.HF_TOKEN) {
      console.error('HuggingFace API anahtarı bulunamadı. Lütfen .env.local dosyasını kontrol edin.');
    }
    if (!this.RUNWAY_TOKEN) {
      console.error('Runway ML API anahtarı bulunamadı. Lütfen .env.local dosyasını kontrol edin.');
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

      if (!this.RUNWAY_TOKEN) {
        throw new Error('Runway ML API anahtarı bulunamadı');
      }

      // 1. İlk olarak video oluşturma isteği gönder
      const generateResponse = await fetch(`${this.RUNWAY_API}/text-to-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.RUNWAY_TOKEN}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          num_frames: 150,
          fps: 30,
          guidance_scale: 12.5,
          height: 576,
          width: 1024,
          seed: Math.floor(Math.random() * 1000000)
        })
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.text();
        console.error('Runway ML API hatası:', errorData);
        throw new Error(`Video oluşturma hatası: ${generateResponse.status} - ${errorData || generateResponse.statusText}`);
      }

      const { id } = await generateResponse.json();

      // 2. Video hazır olana kadar bekle
      let status = 'starting';
      let videoUrl = '';
      
      while (status !== 'completed' && status !== 'failed') {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekle

        const statusResponse = await fetch(`${this.RUNWAY_API}/text-to-video/${id}`, {
          headers: {
            'Authorization': `Bearer ${this.RUNWAY_TOKEN}`,
          },
        });

        if (!statusResponse.ok) {
          const errorData = await statusResponse.text();
          console.error('Runway ML API durum kontrolü hatası:', errorData);
          throw new Error(`Video durum kontrolü hatası: ${statusResponse.status} - ${errorData || statusResponse.statusText}`);
        }

        const statusData = await statusResponse.json();
        status = statusData.status;
        
        if (status === 'completed') {
          videoUrl = statusData.output.url;
        } else if (status === 'failed') {
          throw new Error('Video oluşturma başarısız oldu: ' + statusData.error || 'Bilinmeyen hata');
        }

        console.log('Video durumu:', status);
      }

      if (!videoUrl) {
        throw new Error('Video URL alınamadı');
      }

      return { url: videoUrl };
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
