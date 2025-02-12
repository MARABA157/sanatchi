import { useState } from 'react';
import { ANIMATION_STYLES } from '../lib/constants/animations';

interface GeneratedContent {
  imageUrl: string;
  animationStyle: typeof ANIMATION_STYLES[0];
}

export function useVideoGeneration() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);

  const generateVideo = async () => {
    setLoading(true);
    try {
      // Simüle edilmiş AI görsel oluşturma süreci
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // AI tarafından oluşturulmuş görsel örnekleri
      const images = [
        'https://images.unsplash.com/photo-1686191128892-3b960bb41da1',
        'https://images.unsplash.com/photo-1684779847639-fbcc5a57dfe9',
        'https://images.unsplash.com/photo-1683009427666-340595e57e43',
        'https://images.unsplash.com/photo-1683009427619-e3dcc9b05da7',
        'https://images.unsplash.com/photo-1682687220742-aba19a84df55',
        'https://images.unsplash.com/photo-1682687221038-404670f19d6b'
      ];
      
      // Rastgele bir görsel ve animasyon stili seç
      const randomImage = images[Math.floor(Math.random() * images.length)];
      const randomStyle = ANIMATION_STYLES[Math.floor(Math.random() * ANIMATION_STYLES.length)];
      
      setContent({
        imageUrl: randomImage,
        animationStyle: randomStyle,
      });
    } catch (error) {
      console.error('Animation generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    content,
    generateVideo,
  };
}