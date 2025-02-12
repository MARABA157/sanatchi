// src/services/videoGeneration.ts
import { supabase } from '@/lib/supabase';

export interface VideoGenerationParams {
  userId: string;
  prompt: string;
  style: 'realistic' | '3d' | 'anime' | 'cartoon';
  duration: number;
  resolution: '480p' | '720p' | '1080p';
}

export interface VideoGenerationResult {
  id: string;
  user_id: string;
  prompt: string;
  style: VideoGenerationParams['style'];
  duration: number;
  resolution: VideoGenerationParams['resolution'];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  url?: string;
  error?: string;
  created_at: string;
  updated_at: string;
}

export const generateVideo = async (params: VideoGenerationParams): Promise<VideoGenerationResult> => {
  const { data, error } = await supabase
    .from('video_generations')
    .insert({
      ...params,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Video generation failed: ${error.message}`);
  }

  return data;
};

export const checkVideoProgress = async (videoId: string): Promise<VideoGenerationResult> => {
  const { data, error } = await supabase
    .from('video_generations')
    .select('*')
    .eq('id', videoId)
    .single();

  if (error) {
    throw new Error(`Failed to check video progress: ${error.message}`);
  }

  return data;
};

export const deleteVideo = async (videoId: string): Promise<void> => {
  const { error } = await supabase
    .from('video_generations')
    .delete()
    .eq('id', videoId);

  if (error) {
    throw new Error(`Failed to delete video: ${error.message}`);
  }
};
