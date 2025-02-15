const express = require('express');
const cors = require('cors');
const path = require('path');
const { PythonShell } = require('python-shell');
const axios = require('axios');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static dosyaları serve et
app.use(express.static(path.join(__dirname, '../dist')));

// API endpoints
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API çalışıyor!' });
});

// Video endpoint
app.post('/api/generate/video', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Prompt gerekli' });
  }

  const options = {
    scriptPath: path.join(__dirname, '../src/services/ai'),
    args: [prompt]
  };

  PythonShell.run('generate_video.py', options)
    .then(results => {
      const result = JSON.parse(results[results.length - 1]);
      res.json(result);
    })
    .catch(err => {
      console.error('Video üretme hatası:', err);
      res.status(500).json({ success: false, error: err.message });
    });
});

// Konuşma endpoint
app.post('/api/generate/speech', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, error: 'Metin gerekli' });
  }

  const options = {
    scriptPath: path.join(__dirname, '../src/services/ai'),
    args: [text]
  };

  PythonShell.run('generate_speech.py', options)
    .then(results => {
      const result = JSON.parse(results[results.length - 1]);
      res.json(result);
    })
    .catch(err => {
      console.error('Konuşma üretme hatası:', err);
      res.status(500).json({ success: false, error: err.message });
    });
});

// Müzik endpoint
app.post('/api/generate/music', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Prompt gerekli' });
  }

  // Müzik üretme kodu buraya gelecek
  res.json({ success: true, message: 'Müzik üretme endpoint' });
});

// Ollama Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, model = 'llama2' } = req.body;
  
  try {
    const response = await axios.post('http://localhost:11434/api/chat', {
      model,
      messages: [{ role: 'user', content: message }]
    });
    
    res.json({
      success: true,
      response: response.data.message.content
    });
  } catch (error) {
    console.error('Ollama chat hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ollama Resim üretme endpoint
app.post('/api/generate/image', async (req, res) => {
  const { prompt, model = 'llava' } = req.body;
  
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model,
      prompt
    });
    
    res.json({
      success: true,
      response: response.data.response
    });
  } catch (error) {
    console.error('Ollama resim üretme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tüm diğer istekleri index.html'e yönlendir
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Hata yakalama
app.use((err, req, res, next) => {
  console.error('Hata:', err);
  res.status(500).json({ success: false, error: err.message });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
