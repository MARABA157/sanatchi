import axios from 'axios';
import { env } from '@/config/env';

interface FineTuneParams {
  model: string;
  dataset: any[];
  params: {
    epochs: number;
    batchSize: number;
    learningRate: number;
  };
}

interface TrainingMetrics {
  accuracy: number;
  loss: number;
  epochNumber: number;
}

export class HuggingFaceAPI {
  private static readonly API_URL = 'https://api-inference.huggingface.co/models';
  private static readonly API_KEY = env.HUGGINGFACE_API_KEY;

  public static async fineTune(params: FineTuneParams): Promise<TrainingMetrics> {
    try {
      const response = await axios.post(
        `${this.API_URL}/${params.model}/train`,
        {
          dataset: params.dataset,
          training_params: {
            num_train_epochs: params.params.epochs,
            per_device_train_batch_size: params.params.batchSize,
            learning_rate: params.params.learningRate,
            evaluation_strategy: 'steps',
            eval_steps: 500,
            save_strategy: 'steps',
            save_steps: 1000,
            logging_dir: './logs',
            push_to_hub: true
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        accuracy: response.data.eval_accuracy || 0,
        loss: response.data.eval_loss || 0,
        epochNumber: response.data.epoch || 0
      };
    } catch (error) {
      console.error('Fine-tuning failed:', error);
      throw error;
    }
  }

  public static async generateText(prompt: string, model: string = 'gpt2'): Promise<string> {
    try {
      const response = await axios.post(
        `${this.API_URL}/${model}`,
        { inputs: prompt },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`
          }
        }
      );

      return response.data[0].generated_text;
    } catch (error) {
      console.error('Text generation failed:', error);
      throw error;
    }
  }

  public static async generateImage(prompt: string, model: string = 'stable-diffusion-v1-5'): Promise<string> {
    try {
      const response = await axios.post(
        `${this.API_URL}/${model}`,
        { inputs: prompt },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`
          },
          responseType: 'arraybuffer'
        }
      );

      return `data:image/jpeg;base64,${Buffer.from(response.data).toString('base64')}`;
    } catch (error) {
      console.error('Image generation failed:', error);
      throw error;
    }
  }

  public static async generateVideo(prompt: string, model: string = 'modelscope-damo-text-to-video-synthesis'): Promise<string> {
    try {
      const response = await axios.post(
        `${this.API_URL}/${model}`,
        { 
          inputs: prompt,
          parameters: {
            num_frames: 30,
            width: 768,
            height: 432
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`
          },
          responseType: 'arraybuffer'
        }
      );

      return `data:video/mp4;base64,${Buffer.from(response.data).toString('base64')}`;
    } catch (error) {
      console.error('Video generation failed:', error);
      throw error;
    }
  }
}
