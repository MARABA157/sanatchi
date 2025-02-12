export type AIModel = 'dall-e-2' | 'dall-e-3' | 'gpt-3.5-turbo' | 'gpt-4';

export interface AIModelConfig {
  id: AIModel;
  name: string;
  description: string;
  endpoint: string;
  api_key: string;
  max_tokens?: number;
  temperature?: number;
  cost_per_token: number;
  created_at: string;
  updated_at: string;
}
