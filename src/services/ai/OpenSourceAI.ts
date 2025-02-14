import { AI_MODELS } from './models';

export class OpenSourceAI {
  private static instance: OpenSourceAI;
  private readonly HF_API = 'https://api-inference.huggingface.co/models';
  private readonly HF_TOKEN: string;

  private readonly API_ENDPOINTS = {
    STABLE_DIFFUSION: `${this.HF_API}/stabilityai/stable-diffusion-xl-base-1.0`,
    TEXT_TO_VIDEO: `${this.HF_API}/damo-vilab/text-to-video-ms-1.7b`,
    CHAT_COMPLETION: '/api/generate',
    AUDIO_GENERATION: `${this.HF_API}/facebook/musicgen-small`,
    MUSIC_GENERATION: `${this.HF_API}/facebook/musicgen-small`
  };

  private readonly CHAT_MODEL = "llama2";

  private constructor() {
    this.HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
    if (!this.HF_TOKEN) {
      console.warn('HuggingFace API anahtarı bulunamadı');
    }
  }

  public static getInstance(): OpenSourceAI {
    if (!OpenSourceAI.instance) {
      OpenSourceAI.instance = new OpenSourceAI();
    }
    return OpenSourceAI.instance;
  }

  // Video oluşturma
  public async generateVideo(prompt: string): Promise<string> {
    try {
      console.log('Video oluşturuluyor:', prompt);

      const response = await fetch(this.API_ENDPOINTS.TEXT_TO_VIDEO, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_inference_steps: 50,
            guidance_scale: 9,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Video oluşturma hatası: ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Video oluşturma hatası:', error);
      throw error;
    }
  }

  // Chat tamamlama
  public async generateChatCompletion(prompt: string): Promise<string> {
    try {
      console.log('Chat yanıtı oluşturuluyor:', prompt);

      const response = await fetch(this.API_ENDPOINTS.CHAT_COMPLETION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.CHAT_MODEL,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 256,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Ollama API hatası:', errorData);
        throw new Error(`Chat hatası: ${response.status} - ${errorData || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        console.error('Ollama API yanıtı:', data);
        throw new Error('Yanıt alınamadı');
      }

      return data.response;
    } catch (error) {
      console.error('Chat hatası:', error);
      if (error instanceof Error) {
        throw new Error(`Chat hatası: ${error.message}`);
      } else {
        throw new Error('Bilinmeyen bir chat hatası oluştu');
      }
    }
  }

  // Ses oluşturma
  public async generateAudio(prompt: string): Promise<string> {
    try {
      console.log('Ses oluşturuluyor:', prompt);

      const response = await fetch(this.API_ENDPOINTS.AUDIO_GENERATION, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            duration: 10,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ses oluşturma hatası: ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Ses oluşturma hatası:', error);
      throw error;
    }
  }

  // Müzik oluşturma
  public async generateMusic(prompt: string): Promise<string> {
    try {
      console.log('Müzik oluşturuluyor:', prompt);

      const response = await fetch(this.API_ENDPOINTS.MUSIC_GENERATION, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            duration: 10,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Müzik oluşturma hatası: ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Müzik oluşturma hatası:', error);
      throw error;
    }
  }
}
