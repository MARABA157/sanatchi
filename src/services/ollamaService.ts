// API base URL artık proxy üzerinden
const OLLAMA_API_BASE_URL = '/api';

export interface OllamaResponse {
  response: string;
}

export const ollamaService = {
  async chat(message: string): Promise<string> {
    try {
      // Önce video komutu mu kontrol et
      if (message.toLowerCase().includes('/video')) {
        const prompt = message.replace('/video', '').trim();
        const ai = OpenSourceAI.getInstance();
        const result = await ai.generateVideo(prompt);
        return `Video oluşturuldu: ${result.url}`;
      }
      
      // Ses komutu mu kontrol et
      if (message.toLowerCase().includes('/müzik') || message.toLowerCase().includes('/muzik')) {
        const prompt = message.replace(/\/(müzik|muzik)/, '').trim();
        const ai = OpenSourceAI.getInstance();
        const result = await ai.generateAudio(prompt);
        return `Müzik oluşturuldu: ${result.url}`;
      }

      // Normal chat yanıtı
      const response = await fetch(`${OLLAMA_API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: message,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9
          }
        }),
      });

      if (!response.ok) {
        throw new Error('API yanıt vermedi');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }
};
