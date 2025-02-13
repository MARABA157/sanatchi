import React, { useState } from 'react';
import { OpenSourceAI } from '../services/ai/OpenSourceAI';
import { Button, Input, Box, VStack, Text, Spinner } from '@chakra-ui/react';

interface AIVideoProps {
  onVideoGenerated?: (videoUrl: string) => void;
}

export const AIVideo: React.FC<AIVideoProps> = ({ onVideoGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      setError('Lütfen bir açıklama girin');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.generateVideo(prompt);
      setVideoUrl(result.url);
      if (onVideoGenerated) {
        onVideoGenerated(result.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch" w="100%">
      <Input
        placeholder="Video için açıklama girin..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
      />
      <Button
        onClick={handleGenerateVideo}
        isLoading={loading}
        loadingText="Video oluşturuluyor..."
        colorScheme="blue"
      >
        Video Oluştur
      </Button>

      {error && (
        <Text color="red.500">{error}</Text>
      )}

      {videoUrl && (
        <Box mt={4}>
          <video
            controls
            width="100%"
            src={videoUrl}
            style={{ maxWidth: '100%', borderRadius: '8px' }}
          >
            Tarayıcınız video elementini desteklemiyor.
          </video>
        </Box>
      )}

      {loading && (
        <Box textAlign="center">
          <Spinner size="xl" />
          <Text mt={2}>Video oluşturuluyor, lütfen bekleyin...</Text>
        </Box>
      )}
    </VStack>
  );
};
