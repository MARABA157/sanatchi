import React, { useState } from 'react';
import { OpenSourceAI } from '../services/ai/OpenSourceAI';
import { Button, Input, Box, VStack, Text, Spinner } from '@chakra-ui/react';

interface AIAudioProps {
  onAudioGenerated?: (audioUrl: string) => void;
}

export const AIAudio: React.FC<AIAudioProps> = ({ onAudioGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerateAudio = async () => {
    if (!prompt.trim()) {
      setError('Lütfen bir açıklama girin');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.generateAudio(prompt);
      setAudioUrl(result.url);
      if (onAudioGenerated) {
        onAudioGenerated(result.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ses oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch" w="100%">
      <Input
        placeholder="Müzik için açıklama girin..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
      />
      <Button
        onClick={handleGenerateAudio}
        isLoading={loading}
        loadingText="Müzik oluşturuluyor..."
        colorScheme="purple"
      >
        Müzik Oluştur
      </Button>

      {error && (
        <Text color="red.500">{error}</Text>
      )}

      {audioUrl && (
        <Box mt={4}>
          <audio
            controls
            src={audioUrl}
            style={{ width: '100%' }}
          >
            Tarayıcınız audio elementini desteklemiyor.
          </audio>
        </Box>
      )}

      {loading && (
        <Box textAlign="center">
          <Spinner size="xl" />
          <Text mt={2}>Müzik oluşturuluyor, lütfen bekleyin...</Text>
        </Box>
      )}
    </VStack>
  );
};
