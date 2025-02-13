import { useState, useCallback } from 'react';
import { AIModelManager } from '../modelManager';

interface UseAIProps {
  defaultModel?: string;
}

export function useAI({ defaultModel }: UseAIProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modelManager = AIModelManager.getInstance();

  const generateText = useCallback(async (prompt: string, model = defaultModel) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await modelManager.generateText(prompt, model);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Metin üretme hatası');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [defaultModel]);

  const generateImage = useCallback(async (prompt: string, model = defaultModel) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await modelManager.generateImage(prompt, model);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görüntü üretme hatası');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [defaultModel]);

  const generateVideo = useCallback(async (prompt: string, model = defaultModel) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await modelManager.generateVideo(prompt, model);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video üretme hatası');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [defaultModel]);

  const generateMusic = useCallback(async (prompt: string, model = defaultModel) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await modelManager.generateMusic(prompt, model);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Müzik üretme hatası');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [defaultModel]);

  const getModelMetrics = useCallback((modelName: string) => {
    return modelManager.getModelMetrics(modelName);
  }, []);

  const getAllModelMetrics = useCallback(() => {
    return modelManager.getAllModelMetrics();
  }, []);

  return {
    generateText,
    generateImage,
    generateVideo,
    generateMusic,
    getModelMetrics,
    getAllModelMetrics,
    isLoading,
    error
  };
}
