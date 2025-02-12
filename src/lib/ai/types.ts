export interface ModelMetrics {
  accuracy: number;
  usage: number;
  lastUpdated: Date;
}

export interface GenerationParameters {
  text?: {
    max_length: number;
    temperature: number;
  };
  image?: {
    num_inference_steps: number;
    guidance_scale: number;
  };
  video?: {
    num_frames: number;
    fps: number;
  };
  audio?: {
    duration: number;
    sample_rate: number;
  };
}

export interface GenerationResponse {
  text?: {
    generated_text: string;
  };
  image?: {
    image: string;
  };
  video?: {
    video: string;
  };
  audio?: {
    audio: string;
  };
}

export type ModelType = 'text' | 'image' | 'video' | 'audio';

export interface ModelConfig {
  name: string;
  type: ModelType;
  path: string;
  defaultParams: GenerationParameters;
}
