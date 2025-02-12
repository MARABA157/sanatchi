import { supabase } from '@/lib/supabase';

export interface ArtworkAnalysis {
  style: string;
  period: string;
  technique: string;
  colors: string[];
  mood: string;
  subjects: string[];
}

export interface SimilarArtwork {
  id: string;
  title: string;
  artist: string;
  similarity_score: number;
  image_url: string;
}

export interface ArtistRecommendation {
  id: string;
  name: string;
  style: string;
  period: string;
  image_url: string;
  similarity_score: number;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  style: string;
  timestamp: string;
}

export const aiServices = {
  // Sanat eseri analizi
  async analyzeArtwork(imageUrl: string): Promise<ArtworkAnalysis> {
    const { data, error } = await supabase.functions.invoke('analyze-artwork', {
      body: { image_url: imageUrl }
    });

    if (error) throw error;
    return data;
  },

  // Benzer eserleri bulma
  async findSimilarArtworks(artworkId: string): Promise<SimilarArtwork[]> {
    const { data, error } = await supabase.functions.invoke('find-similar-artworks', {
      body: { artwork_id: artworkId }
    });

    if (error) throw error;
    return data;
  },

  // Sanat stili tanıma
  async recognizeStyle(imageUrl: string): Promise<string[]> {
    const { data, error } = await supabase.functions.invoke('recognize-style', {
      body: { image_url: imageUrl }
    });

    if (error) throw error;
    return data;
  },

  // Sanatçı önerileri
  async recommendArtists(userId: string): Promise<ArtistRecommendation[]> {
    const { data, error } = await supabase.functions.invoke('recommend-artists', {
      body: { user_id: userId }
    });

    if (error) throw error;
    return data;
  },

  // Görsel arama
  async searchByImage(imageUrl: string): Promise<SimilarArtwork[]> {
    const { data, error } = await supabase.functions.invoke('search-by-image', {
      body: { image_url: imageUrl }
    });

    if (error) throw error;
    return data;
  },

  // Resim üretme
  async generateImage(prompt: string, style: string): Promise<GeneratedImage> {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt, style }
    });

    if (error) throw error;
    return data;
  }
};
