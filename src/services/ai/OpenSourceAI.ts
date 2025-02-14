import { AI_MODELS } from './models';

export class OpenSourceAI {
  private static instance: OpenSourceAI;
  private readonly STABILITY_API = 'https://api.stability.ai';
  private readonly STABILITY_TOKEN: string;
  private readonly HF_API = 'https://api-inference.huggingface.co/models';
  private readonly HF_TOKEN: string;

  private readonly API_ENDPOINTS = {
    VIDEO_MODELS: {
      MODELSCOPE: 'text-to-video',
      ZEROSCOPE: 'text-to-video-xl',
      ANIMATEDIFF: 'text-to-animation'
    },
    CHAT_COMPLETION: 'http://localhost:11434/api/generate',
    AUDIO_GENERATION: `${this.HF_API}/facebook/musicgen-small`,
    MUSIC_GENERATION: `${this.HF_API}/facebook/musicgen-small`
  };

  private readonly VIDEO_SETTINGS = {
    MODELSCOPE: {
      width: 576,
      height: 320,
      cfg_scale: 15,
      clip_guidance_preset: "FAST_BLUE",
      sampler: "K_DPM_2_ANCESTRAL",
      samples: 1,
      seed: 0,
      steps: 50
    },
    ZEROSCOPE: {
      width: 576,
      height: 320,
      cfg_scale: 15,
      clip_guidance_preset: "FAST_BLUE",
      sampler: "K_DPM_2_ANCESTRAL",
      samples: 1,
      seed: 0,
      steps: 50
    },
    ANIMATEDIFF: {
      width: 576,
      height: 320,
      cfg_scale: 15,
      clip_guidance_preset: "FAST_BLUE",
      sampler: "K_DPM_2_ANCESTRAL",
      samples: 1,
      seed: 0,
      steps: 50
    }
  };

  private readonly CHAT_MODEL = "llama2";

  private constructor() {
    this.HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
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
  public async generateVideo(prompt: string, model: keyof typeof this.API_ENDPOINTS.VIDEO_MODELS = 'ZEROSCOPE'): Promise<{ url: string }> {
    try {
      console.log('Video oluşturuluyor:', prompt, 'Model:', model);

      if (!this.STABILITY_TOKEN) {
        throw new Error('Stability AI API anahtarı bulunamadı');
      }

      const endpoint = `${this.STABILITY_API}/v1/generation/${this.API_ENDPOINTS.VIDEO_MODELS[model]}`;
      const settings = { ...this.VIDEO_SETTINGS[model], text_prompts: [{ text: prompt }] };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.STABILITY_TOKEN}`,
          'Accept': 'video/mp4'
        },
        body: JSON.stringify(settings)
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
