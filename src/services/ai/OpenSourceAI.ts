import { AI_MODELS } from './models';

export class OpenSourceAI {
  private static instance: OpenSourceAI;
  private readonly baseUrl = '/api'; // Proxy üzerinden
  private readonly HF_API = 'https://api-inference.huggingface.co/models';
  private readonly HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_TOKEN;
  private readonly REPLICATE_API = 'https://api.replicate.com/v1';
  private readonly REPLICATE_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN || '';
  private readonly CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1';
  private readonly CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  private readonly CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '';
  private readonly CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET || '';

  private readonly API_ENDPOINTS = {
    STABLE_DIFFUSION: `${this.HF_API}/stabilityai/stable-diffusion-xl-base-1.0`,
    CHAT_COMPLETION_HF: `${this.HF_API}/microsoft/phi-2`,
    CHAT_COMPLETION_OLLAMA: 'http://localhost:11434/api/generate',
    VIDEO_GENERATION: `${this.REPLICATE_API}/predictions`,
    VIDEO_GENERATION_REPLICATE: `${this.REPLICATE_API}/predictions`,
    AUDIO_GENERATION: `${this.REPLICATE_API}/predictions`,
    MUSIC_GENERATION: `${this.REPLICATE_API}/predictions`
  };

  private readonly VIDEO_MODELS = {
    ZEROSCOPE: "anhnguyen31/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
    MODELSCOPE: "damo-vilab/text-to-video-ms-1.7b:b28e2b68679bc7a8f382999330ed60118d97afbb0c7daa44d634c6e7e1fdbbc1",
    ANIMATEDIFF: "lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae19d7d0fe58a10900515"
  };

  private readonly VIDEO_SETTINGS = {
    ZEROSCOPE: {
      fps: 24,
      num_frames: 50,
      num_inference_steps: 50,
      motion_bucket_id: 127,
      cond_aug: 0.02
    },
    MODELSCOPE: {
      num_frames: 16,
      num_inference_steps: 50,
      fps: 8,
      motion_bucket_id: 127
    },
    ANIMATEDIFF: {
      motion_module: "mm_sd_v15",
      fps: 8,
      num_frames: 16,
      num_inference_steps: 50
    }
  };

  private readonly CHAT_MODEL = "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3";

  private readonly AUDIO_MODEL = "meta/musicgen:7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906";
  private readonly MUSIC_MODEL = "meta/musicgen:7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906";

  private readonly IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

  private readonly isTestMode = false;

  constructor() {
    console.log('HuggingFace Token:', this.HF_TOKEN ? 'Mevcut' : 'Eksik');
    if (!this.HF_TOKEN) {
      console.error('HuggingFace API token bulunamadı! Lütfen .env.local dosyasını kontrol edin.');
    }
  }

  public static getInstance(): OpenSourceAI {
    if (!OpenSourceAI.instance) {
      OpenSourceAI.instance = new OpenSourceAI();
    }
    return OpenSourceAI.instance;
  }

  // Resim Oluşturma
  public async generateImage(prompt: string): Promise<{ url: string }> {
    try {
      if (!this.HF_TOKEN) {
        throw new Error('HuggingFace API token is not configured');
      }

      console.log('Generating image with prompt:', prompt);

      // Prompt'u zenginleştir
      const enhancedPrompt = `masterpiece, best quality, highly detailed, ${prompt}`;
      
      const response = await fetch(this.API_ENDPOINTS.STABLE_DIFFUSION, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            negative_prompt: "blurry, bad quality, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, artist name, (worst quality:2), (low quality:2), (normal quality:2), lowres, bad anatomy, bad hands, error, missing fingers, extra digit, fewer digits, cropped, text, jpeg artifacts, signature, watermark, username, artist name",
            num_inference_steps: 50, // Daha fazla adım = daha iyi kalite
            guidance_scale: 8.5,  // Prompt'a daha fazla bağlılık
            width: 1024,  // Daha yüksek çözünürlük
            height: 1024, // Daha yüksek çözünürlük
            sampler: "DPM++ 2M Karras", // Daha iyi sampler
            seed: Math.floor(Math.random() * 2147483647), // Rastgele seed
            scheduler: "K_EULER_ANCESTRAL", // Daha iyi scheduler
            num_images_per_prompt: 1,
            clip_skip: 2, // Daha iyi stil kontrolü
            denoising_strength: 0.7 // Daha detaylı görüntü
          }
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API error:', errorData);
        throw new Error(`HuggingFace API hatasi: ${response.status} - ${errorData?.error || response.statusText}`);
      }

      // HuggingFace API direkt olarak blob döndürür
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      console.log('Generated image URL:', imageUrl);
      return { url: imageUrl };
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  // Chat tamamlama
  public async generateChatCompletion(prompt: string): Promise<string> {
    try {
      if (!this.REPLICATE_TOKEN) {
        throw new Error('Replicate API token is not configured');
      }

      console.log('Generating chat completion with prompt:', prompt);

      const response = await fetch(this.API_ENDPOINTS.CHAT_COMPLETION, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.REPLICATE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: this.CHAT_MODEL,
          input: {
            prompt: `[INST] ${prompt} [/INST]`,
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            top_k: 50,
            presence_penalty: 1,
            frequency_penalty: 1,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Chat completion failed: ${response.statusText}`);
      }

      const data = await response.json();
      const result = await this.waitForReplicateResult(data.id);
      
      if (!result || !result.join) {
        throw new Error('No chat completion generated');
      }

      return result.join('');
    } catch (error) {
      console.error('Error generating chat completion:', error);
      throw error;
    }
  }

  // Video Oluşturma
  public async generateVideo(prompt: string, model: keyof typeof this.VIDEO_MODELS = 'ZEROSCOPE'): Promise<{ url: string }> {
    try {
      if (!this.REPLICATE_TOKEN) {
        throw new Error('Replicate API token is not configured');
      }

      console.log('Generating video with prompt:', prompt, 'using model:', model);

      const modelVersion = this.VIDEO_MODELS[model];
      const settings = this.VIDEO_SETTINGS[model];

      const response = await fetch(this.API_ENDPOINTS.VIDEO_GENERATION, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.REPLICATE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: modelVersion,
          input: {
            prompt: prompt,
            ...settings
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Video generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      const result = await this.waitForReplicateResult(data.id);
      
      if (!result || !result[0]) {
        throw new Error('No video generated');
      }

      return { url: result[0] };
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  }

  // Ses Oluşturma
  public async generateAudio(prompt: string, duration: number, speed: number = 1.0): Promise<{ url: string }> {
    try {
      if (!this.REPLICATE_TOKEN) {
        throw new Error('Replicate API token is not configured');
      }

      console.log('Generating audio with prompt:', prompt);

      const response = await fetch(this.API_ENDPOINTS.AUDIO_GENERATION, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.REPLICATE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: this.AUDIO_MODEL,
          input: {
            prompt: prompt,
            duration: duration,
            model_version: "melody",
            output_format: "wav",
            temperature: 1,
            speed: speed,
            top_k: 250,
            top_p: 0.9,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Audio generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Replicate asenkron çalışır, sonucu bekleyelim
      const result = await this.waitForReplicateResult(data.id);
      
      if (!result || !result[0]) {
        throw new Error('No audio generated');
      }

      return { url: result[0] };
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    }
  }

  // Müzik Oluşturma
  public async generateMusic(prompt: string, duration: number, tempo: number = 120): Promise<{ url: string }> {
    try {
      if (!this.REPLICATE_TOKEN) {
        throw new Error('Replicate API token is not configured');
      }

      console.log('Generating music with prompt:', prompt);

      const response = await fetch(this.API_ENDPOINTS.MUSIC_GENERATION, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.REPLICATE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: this.MUSIC_MODEL,
          input: {
            prompt: prompt,
            duration: duration,
            model_version: "large",
            output_format: "wav",
            temperature: 1,
            tempo: tempo,
            top_k: 250,
            top_p: 0.9,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Music generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Replicate asenkron çalışır, sonucu bekleyelim
      const result = await this.waitForReplicateResult(data.id);
      
      if (!result || !result[0]) {
        throw new Error('No music generated');
      }

      return { url: result[0] };
    } catch (error) {
      console.error('Error generating music:', error);
      throw error;
    }
  }

  // Replicate sonucunu bekle
  private async waitForReplicateResult(id: string): Promise<string[]> {
    const maxAttempts = 60; // 5 dakika (5s * 60)
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(`${this.API_ENDPOINTS.MUSIC_GENERATION}/${id}`, {
        headers: {
          'Authorization': `Token ${this.REPLICATE_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check prediction status: ${response.statusText}`);
      }

      const prediction = await response.json();

      if (prediction.status === 'succeeded') {
        return prediction.output;
      } else if (prediction.status === 'failed') {
        throw new Error('Generation failed');
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 saniye bekle
    }

    throw new Error('Generation timed out');
  }

  // Video ve Resim oluşturma işlemleri için CORS proxy kullanılmalı
  private async makeReplicateRequest(endpoint: string, body: any) {
    const proxyEndpoint = '/replicate' + endpoint; // Vite proxy üzerinden
    try {
      const response = await fetch(proxyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.REPLICATE_TOKEN}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Replicate API error:', error);
      throw error;
    }
  }

  // Replicate sonuçlarını kontrol et
  private async pollReplicateResult(id: string) {
    const maxAttempts = 30;
    const delay = 2000;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await this.makeReplicateRequest(`/predictions/${id}`, {});

      if (!response.ok) {
        throw new Error('Failed to check prediction status');
      }

      const prediction = await response.json();

      if (prediction.status === 'succeeded') {
        return prediction.output;
      } else if (prediction.status === 'failed') {
        throw new Error('Prediction failed');
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
    }

    throw new Error('Timeout waiting for prediction');
  }

  // Cloudinary imza oluşturma
  private async generateSignature(timestamp: number, resourceType: 'video' | 'audio') {
    const params = {
      timestamp,
      resource_type: resourceType,
      api_key: this.CLOUDINARY_API_KEY
    };

    const stringToSign = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&') + this.CLOUDINARY_API_SECRET;

    // SHA-1 hash oluştur
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  }
}
