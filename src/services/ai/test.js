require('dotenv').config();

import { writeFileSync } from 'fs';

async function testAPI() {
  try {
    // HuggingFace API'yi test ediyorum
    const response = await fetch('https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
      },
      body: JSON.stringify({
        inputs: "A running horse in a field",
        parameters: {
          num_frames: 16,
          num_inference_steps: 50,
          guidance_scale: 9,
          negative_prompt: "blurry, bad quality, worst quality"
        }
      })
    });

    console.log('Response Status:', response.status);
    const blob = await response.blob();
    console.log('Video Size:', blob.size);

    // Video dosyası olarak kaydet
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('test.mp4', buffer);
    console.log('Video kaydedildi: test.mp4');

  } catch (error) {
    console.error('Test Error:', error);
  }
}

testAPI();
