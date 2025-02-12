import { useState } from 'react';

interface GenerationState {
  image: string | null;
  video: string | null;
  style: string;
}

export function useAiGeneration() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<GenerationState>({
    image: null,
    video: null,
    style: '',
  });

  // AI görsel ve video oluşturma süreci
  const generate = async () => {
    setLoading(true);
    setState({ image: null, video: null, style: '' });

    try {
      // 1. Adım: Görsel oluştur
      await new Promise(resolve => setTimeout(resolve, 1500));
      const aiImages = [
        'https://images.unsplash.com/photo-1686191128892-3b960bb41da1',
        'https://images.unsplash.com/photo-1684779847639-fbcc5a57dfe9',
        'https://images.unsplash.com/photo-1683009427666-340595e57e43',
      ];
      const randomImage = aiImages[Math.floor(Math.random() * aiImages.length)];
      setState(prev => ({ ...prev, image: randomImage }));

      // 2. Adım: Görseli videoya dönüştür
      await new Promise(resolve => setTimeout(resolve, 2000));
      const aiVideos = [
        'https://player.vimeo.com/video/824804225',
        'https://player.vimeo.com/video/824804262',
        'https://player.vimeo.com/video/824804301',
      ];
      const randomVideo = aiVideos[Math.floor(Math.random() * aiVideos.length)];
      setState(prev => ({ 
        ...prev, 
        video: randomVideo,
        style: ['Surreal Animation', 'Abstract Motion', 'Digital Flow'][Math.floor(Math.random() * 3)]
      }));
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generatedImage: state.image,
    generatedVideo: state.video,
    style: state.style,
    generate,
  };
}