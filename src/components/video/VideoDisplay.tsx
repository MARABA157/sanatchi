import React from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import { ANIMATION_STYLES } from '../../lib/constants/animations';

interface VideoDisplayProps {
  loading: boolean;
  content: {
    imageUrl: string;
    animationStyle: typeof ANIMATION_STYLES[0];
  } | null;
}

export default function VideoDisplay({ loading, content }: VideoDisplayProps) {
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 space-y-2">
        <p>AI animasyon oluşturmak için butona tıklayın</p>
        <p className="text-sm">Her seferinde benzersiz bir animasyon oluşturulacak</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <img
        src={content.imageUrl}
        alt="AI Generated Animation"
        className={`w-full h-full object-contain ${content.animationStyle.className}`}
      />
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
        {content.animationStyle.name}
      </div>
    </div>
  );
}