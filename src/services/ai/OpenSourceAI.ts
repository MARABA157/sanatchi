const API_URL = 'http://localhost:9999/api';

export class OpenSourceAI {
  private static instance: OpenSourceAI;

  private constructor() {}

  public static getInstance(): OpenSourceAI {
    if (!OpenSourceAI.instance) {
      OpenSourceAI.instance = new OpenSourceAI();
    }
    return OpenSourceAI.instance;
  }

  private async callAPI(endpoint: string, data: any): Promise<{ url: string }> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API isteği başarısız oldu: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Bilinmeyen bir hata oluştu');
      }

      if (!result.data) {
        throw new Error('API yanıtında data bulunamadı');
      }

      // Base64'ü Blob'a çevir
      try {
        const binary = atob(result.data);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i <binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array], { type: result.type });
        const url = URL.createObjectURL(blob);
        return { url };
      } catch (error) {
        throw new Error('Base64 dönüşümü başarısız oldu: ' + (error as Error).message);
      }
    } catch (error) {
      console.error('API çağrısı hatası:', error);
      throw error;
    }
  }

  // Video oluşturma
  public async generateVideo(prompt: string): Promise<{ url: string }> {
    if (!prompt) {
      throw new Error('Prompt boş olamaz');
    }
    return this.callAPI('/generate/video', { prompt });
  }

  // Müzik oluşturma
  public async generateMusic(prompt: string): Promise<{ url: string }> {
    if (!prompt) {
      throw new Error('Prompt boş olamaz');
    }
    return this.callAPI('/generate/music', { prompt });
  }

  // Konuşma oluşturma
  public async generateSpeech(text: string): Promise<{ url: string }> {
    if (!text) {
      throw new Error('Metin boş olamaz');
    }
    return this.callAPI('/generate/speech', { text });
  }
}
