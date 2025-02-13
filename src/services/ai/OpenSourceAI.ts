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
    VIDEO_GENERATION: `${this.CLOUDINARY_URL}/${this.CLOUDINARY_CLOUD_NAME}/video/generate`,
    VIDEO_GENERATION_REPLICATE: 'https://api.replicate.com/v1/predictions',
    AUDIO_GENERATION: `${this.CLOUDINARY_URL}/${this.CLOUDINARY_CLOUD_NAME}/audio/generate`
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

  // Chat fonksiyonu
  public async chat(promptStr: string): Promise<{ text: string; model: string }> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptStr }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Chat API error');
      }

      const data = await response.json();
      return {
        text: data.text,
        model: data.model
      };
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }

  public async chatCompletion(prompt: string) {
    try {
      return await this.chat(prompt);
    } catch (error) {
      throw error;
    }
  }

  // Video Oluşturma
  public async generateVideo(prompt: string, options: {
    model?: 'zeroscope' | 'modelscope' | 'animatediff' | 'cloudinary',
    fps?: number,
    num_frames?: number,
    duration?: number
  } = {}) {
    try {
      const model = options.model || 'zeroscope';

      // Cloudinary kullan
      if (model === 'cloudinary') {
        return this.generateVideoWithCloudinary(prompt);
      }

      // Replicate token kontrolü
      if (!this.REPLICATE_TOKEN) {
        throw new Error('Replicate API token is not configured');
      }

      console.log(`Generating video with ${model}...`);

      // Model seçimi
      let modelVersion = '';
      let settings = {};
      
      switch (model) {
        case 'zeroscope':
          modelVersion = this.VIDEO_MODELS.ZEROSCOPE;
          settings = {
            ...this.VIDEO_SETTINGS.ZEROSCOPE,
            fps: options.fps || this.VIDEO_SETTINGS.ZEROSCOPE.fps,
            num_frames: options.num_frames || this.VIDEO_SETTINGS.ZEROSCOPE.num_frames
          };
          break;
        case 'modelscope':
          modelVersion = this.VIDEO_MODELS.MODELSCOPE;
          settings = {
            ...this.VIDEO_SETTINGS.MODELSCOPE,
            fps: options.fps || this.VIDEO_SETTINGS.MODELSCOPE.fps,
            num_frames: options.num_frames || this.VIDEO_SETTINGS.MODELSCOPE.num_frames
          };
          break;
        case 'animatediff':
          modelVersion = this.VIDEO_MODELS.ANIMATEDIFF;
          settings = {
            ...this.VIDEO_SETTINGS.ANIMATEDIFF,
            fps: options.fps || this.VIDEO_SETTINGS.ANIMATEDIFF.fps,
            num_frames: options.num_frames || this.VIDEO_SETTINGS.ANIMATEDIFF.num_frames
          };
          break;
      }

      // API isteği
      const response = await fetch(this.API_ENDPOINTS.VIDEO_GENERATION_REPLICATE, {
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
        const error = await response.json();
        throw new Error(`Replicate API error: ${error.detail || response.statusText}`);
      }

      const prediction = await response.json();
      console.log('Prediction started:', prediction);

      // Sonucu bekle
      const result = await this.waitForReplicateResult(prediction.id);
      console.log('Video generated:', result);

      return {
        url: result.output,
        model: model
      };
    } catch (error) {
      console.error('Video generation error:', error);
      throw error;
    }
  }

  // Replicate sonucunu bekle
  private async waitForReplicateResult(predictionId: string, maxAttempts: number = 60): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${this.API_ENDPOINTS.VIDEO_GENERATION_REPLICATE}/${predictionId}`, {
        headers: {
          'Authorization': `Token ${this.REPLICATE_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check prediction status: ${response.statusText}`);
      }

      const prediction = await response.json();

      if (prediction.status === 'succeeded') {
        return prediction;
      }

      if (prediction.status === 'failed') {
        throw new Error(`Prediction failed: ${prediction.error}`);
      }

      // 2 saniye bekle
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Prediction timed out');
  }

  // Cloudinary ile video oluştur
  private async generateVideoWithCloudinary(prompt: string) {
    if (!this.CLOUDINARY_CLOUD_NAME || !this.CLOUDINARY_API_KEY || !this.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials are not configured');
    }

    const timestamp = Math.round((new Date()).getTime() / 1000);
    const signature = await this.generateSignature(timestamp, 'video');

    const formData = new FormData();
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', this.CLOUDINARY_API_KEY);
    formData.append('signature', signature);
    formData.append('prompt', prompt);
    formData.append('model', 'stable-diffusion');

    const response = await fetch(this.API_ENDPOINTS.VIDEO_GENERATION, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      model: 'cloudinary'
    };
  }

  // Ses Oluşturma
  public async generateAudio(prompt: string, duration: number = 30, speed: number = 1.0) {
    try {
      if (!this.CLOUDINARY_CLOUD_NAME || !this.CLOUDINARY_API_KEY || !this.CLOUDINARY_API_SECRET) {
        throw new Error('Cloudinary credentials are not configured');
      }

      const timestamp = Math.round((new Date()).getTime() / 1000);
      const signature = await this.generateSignature(timestamp, 'audio');

      const formData = new FormData();
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', this.CLOUDINARY_API_KEY);
      formData.append('signature', signature);
      formData.append('prompt', prompt);
      formData.append('model', 'text-to-speech');
      formData.append('duration', duration.toString());
      formData.append('speed', speed.toString());
      formData.append('voice', 'tr-TR-Standard-A'); // Türkçe ses
      formData.append('audio_codec', 'mp3');
      formData.append('bit_rate', '192k');
      formData.append('sample_rate', '44100');

      console.log('Generating audio with parameters:', {
        prompt,
        duration,
        speed,
        timestamp
      });

      const response = await fetch(this.API_ENDPOINTS.AUDIO_GENERATION, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Cloudinary API error:', errorData);
        throw new Error(`Cloudinary API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Audio generation response:', data);

      return {
        url: data.secure_url,
        model: 'cloudinary-audio',
        duration: data.duration || duration
      };
    } catch (error) {
      console.error('Audio generation error:', error);
      throw error;
    }
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
}
