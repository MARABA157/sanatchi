import React from 'react';
import { useVideoGeneration } from '../../hooks/useVideoGeneration';
import VideoGenerationButton from './VideoGenerationButton';
import VideoDisplay from './VideoDisplay';

export default function VideoGenerator() {
  const { loading, content, generateVideo } = useVideoGeneration();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">AI Animasyon Oluşturucu</h2>
        
        <div className="flex justify-center mb-6">
          <VideoGenerationButton onClick={generateVideo} loading={loading} />
        </div>

        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-50">
          <VideoDisplay loading={loading} content={content} />
        </div>
      </div>
    </div>
  );
}