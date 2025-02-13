import React, { useState } from 'react';
import { OpenSourceAI } from '@/services/ai/OpenSourceAI';
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';

const AIImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('Lütfen bir açıklama girin');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.generateImage(prompt);
      setImageUrl(result.url);
    } catch (error) {
      console.error('Error:', error);
      setError('Resim oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={4}>
      <Box>
        <TextField
          placeholder="Resim için açıklama girin..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          fullWidth
          disabled={loading}
          variant="outlined"
        />
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
          onClick={handleGenerateImage}
          disabled={loading}
          fullWidth
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Resim oluşturuluyor...' : 'Resim Oluştur'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {loading && (
        <Box textAlign="center" py={4}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            Resim oluşturuluyor, lütfen bekleyin...
          </Typography>
        </Box>
      )}

      {imageUrl && !loading && (
        <Box
          border={1}
          borderColor="grey.300"
          borderRadius={1}
          overflow="hidden"
          boxShadow={3}
        >
          <img
            src={imageUrl}
            alt="Generated Image"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
            onError={() => setError('Resim yüklenemedi')}
          />
        </Box>
      )}
    </Stack>
  );
};

export default AIImageGenerator;
