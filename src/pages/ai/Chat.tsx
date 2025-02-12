import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import AIChatBox from '@/components/AIChatBox';

const AIChat = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          AI Chat
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Yapay Zeka ile Sohbet Edin
        </Typography>
      </Box>

      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          minHeight: '600px'
        }}
      >
        <AIChatBox />
      </Box>
    </Container>
  );
};

export default AIChat;
