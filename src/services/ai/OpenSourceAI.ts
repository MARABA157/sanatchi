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
    STABLE_DIFFUSION: `${this.HF_API}/runwayml/stable-diffusion-v1-5`,
    CHAT_COMPLETION: `${this.HF_API}/facebook/blenderbot-400M-distill`,
    VIDEO_GENERATION: `${this.CLOUDINARY_URL}/${this.CLOUDINARY_CLOUD_NAME}/video/generate`,
    AUDIO_GENERATION: `${this.CLOUDINARY_URL}/${this.CLOUDINARY_CLOUD_NAME}/audio/generate`
  };

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
      console.log('Using HF token:', this.HF_TOKEN);

      const response = await fetch(this.API_ENDPOINTS.STABLE_DIFFUSION, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: "blurry, bad quality, worst quality",
            num_inference_steps: 30,
            guidance_scale: 7.5,
            width: 512,
            height: 512
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
  public async chat(promptStr: string): Promise<string> {
    try {
      if (!this.HF_TOKEN) {
        throw new Error('HuggingFace API token is not configured');
      }

      const response = await fetch(this.API_ENDPOINTS.CHAT_COMPLETION, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: promptStr }),
      });

      if (!response.ok) {
        throw new Error(`HuggingFace API hatasi: ${response.status}`);
      }

      const data = await response.json();
      return data.generated_text || "Üzgünüm, yanıt üretemiyorum.";

    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }

  // Chat Tamamlama
  public async chatCompletion(prompt: string) {
    try {
      const response = await this.chat(prompt);
      return {
        text: response,
        model: 'blenderbot'
      };
    } catch (error) {
      throw error;
    }
  }

  // Video Oluşturma
  public async generateVideo(prompt: string) {
    try {
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
        model: 'cloudinary-video'
      };
    } catch (error) {
      console.error('Video generation error:', error);
      throw error;
    }
  }

  // Ses Oluşturma
  public async generateAudio(prompt: string) {
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

      const response = await fetch(this.API_ENDPOINTS.AUDIO_GENERATION, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Cloudinary API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        model: 'cloudinary-audio'
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
