/// <reference types="vite/client" />
import axios from 'axios';

export interface ImageGenerationResponse {
  imageUrl: string;
  error?: string;
}

export async function generateArtImage(prompt: string): Promise<ImageGenerationResponse> {
  try {
    const response = await axios.post<ImageGenerationResponse>('/api/images/generate', { prompt });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        imageUrl: '',
        error: error.response?.data?.message || 'Resim oluşturulurken bir hata oluştu',
      };
    }
    return {
      imageUrl: '',
      error: 'Beklenmeyen bir hata oluştu',
    };
  }
}
