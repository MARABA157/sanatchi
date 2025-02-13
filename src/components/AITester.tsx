import React from 'react';
import { OpenSourceAI } from '../services/ai/OpenSourceAI';
import {
  Box,
  Button,
  Stack,
  Typography
} from '@mui/material';

export const AITester: React.FC = () => {
  const testVideo = async () => {
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.generateVideo("A dog playing in the park");
      console.log('Video URL:', result.url);
    } catch (error) {
      console.error('Video test error:', error);
    }
  };

  const testAudio = async () => {
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.generateAudio("Create a happy jazz melody");
      console.log('Audio URL:', result.url);
    } catch (error) {
      console.error('Audio test error:', error);
    }
  };

  return (
    <Stack spacing={4} sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold">
        AI Test Panel
      </Typography>
      
      <Box>
        <Button 
          onClick={testVideo} 
          variant="contained" 
          color="primary" 
          sx={{ m: 1 }}
        >
          Test Video Generation
        </Button>
        <Button 
          onClick={testAudio} 
          variant="contained" 
          color="secondary" 
          sx={{ m: 1 }}
        >
          Test Audio Generation
        </Button>
      </Box>
    </Stack>
  );
};

export default AITester;
