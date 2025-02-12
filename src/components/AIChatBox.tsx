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

const AIChatBox: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.chat(input);
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="2xl" mx="auto" p={4} bgcolor="background.paper" borderRadius={2} boxShadow={3}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mesajınızı yazın..."
            multiline
            rows={4}
            disabled={loading}
            fullWidth
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Yanıt bekleniyor...' : 'Gönder'}
          </Button>
        </Stack>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {response && (
        <Box mt={4} p={4} bgcolor="grey.50" borderRadius={1}>
          <Typography whiteSpace="pre-wrap">{response}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default AIChatBox;
