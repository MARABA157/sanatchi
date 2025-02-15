import { useState } from 'react';

interface GenerationState {
  image: string | null;
  video: string | null;
  style: string;
}

interface ApiResponse {
  success: boolean;
  path?: string;
  error?: string;
}

export function useAiGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<GenerationState>({
    image: null,
    video: null,
    style: '',
  });

  const callApi = async (endpoint: string, data: any): Promise<ApiResponse> => {
    const response = await fetch(`http://localhost:9999/api/generate/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return response.json();
  };

  // AI görsel ve video oluşturma süreci
  const generate = async (prompt: string) => {
    setLoading(true);
    setError(null);
    setState({ image: null, video: null, style: '' });

    try {
      // Video oluştur
      const videoResult = await callApi('video', { prompt });
      if (!videoResult.success) {
        throw new Error(videoResult.error || 'Video oluşturma hatası');
      }
      setState(prev => ({ 
        ...prev, 
        video: videoResult.path,
        style: 'AI Generated Video'
      }));

      // Ses oluştur
      const speechResult = await callApi('speech', { text: prompt });
      if (!speechResult.success) {
        throw new Error(speechResult.error || 'Ses oluşturma hatası');
      }
      
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error instanceof Error ? error.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    state,
    generate
  };
}