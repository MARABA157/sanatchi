import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeArtwork(imageUrl: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Bu sanat eserini analiz et. Stil, teknik, dönem ve duygusal etki açısından detaylı bir analiz yap."
            },
            {
              type: "image_url",
              image_url: imageUrl
            }
          ]
        }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Sanat analizi hatası:', error);
    throw error;
  }
}

export async function getArtisticSuggestions(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Sen bir sanat danışmanısın. Sanatçılara teknik, stil ve kompozisyon konularında yardımcı oluyorsun."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Öneri hatası:', error);
    throw error;
  }
}

export async function generateArtworkDescription(imageUrl: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Bu sanat eseri için etkileyici bir açıklama yaz. Eserin öne çıkan özelliklerini, tekniğini ve yarattığı duyguları vurgula."
            },
            {
              type: "image_url",
              image_url: imageUrl
            }
          ]
        }
      ],
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Açıklama oluşturma hatası:', error);
    throw error;
  }
}
