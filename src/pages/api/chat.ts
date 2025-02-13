import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isDevelopment = process.env.NODE_ENV === 'development';

  try {
    const { prompt } = req.body;

    // Geliştirme ortamında Ollama'yı dene
    if (isDevelopment) {
      try {
        const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "llama2",
            prompt: prompt,
            stream: false,
            options: {
              temperature: 0.7,
              top_p: 0.9,
              max_tokens: 500
            }
          }),
        });

        if (ollamaResponse.ok) {
          const data = await ollamaResponse.json();
          return res.status(200).json({ 
            text: data.response,
            model: 'Llama2'
          });
        }
        // Ollama başarısız olursa GPT-2'ye geç
        console.log('Ollama failed, falling back to GPT-2');
      } catch (error) {
        console.log('Ollama error, falling back to GPT-2:', error);
      }
    }

    // GPT-2'yi kullan (Ollama başarısız olduğunda veya production'da)
    const HF_TOKEN = process.env.VITE_HUGGINGFACE_API_TOKEN;

    if (!HF_TOKEN) {
      throw new Error('HuggingFace API token is not configured');
    }

    console.log('Using GPT-2 model');
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 100,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.2,
          do_sample: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HuggingFace API error:', errorText);
      throw new Error(`HuggingFace API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('GPT-2 response:', data);

    const generatedText = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
    
    if (!generatedText) {
      throw new Error('No response from model');
    }

    const response_text = generatedText.replace(prompt, '').trim();
    
    res.status(200).json({ 
      text: response_text || "Üzgünüm, yanıt üretemiyorum.",
      model: 'GPT-2'
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
