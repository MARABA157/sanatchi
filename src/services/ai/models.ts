// Açık kaynak AI modelleri için servis tanımlamaları
export const AI_MODELS = {
  // Stable Diffusion tabanlı modeller
  IMAGE_GENERATION: {
    name: 'Stable Diffusion XL',
    endpoint: 'runwayml/stable-diffusion-v1-5',
    type: 'text-to-image'
  },
  STYLE_TRANSFER: {
    name: 'CLIP + VGG19',
    endpoint: 'openai/clip-vit-base-patch32',
    type: 'style-transfer'
  },
  IMAGE_UPSCALE: {
    name: 'Real-ESRGAN',
    endpoint: 'xinntao/realesrgan',
    type: 'upscaling'
  },
  IMAGE_RESTORATION: {
    name: 'GFPGAN',
    endpoint: 'tencentarc/gfpgan',
    type: 'restoration'
  },
  // LLaMA tabanlı modeller
  TEXT_GENERATION: {
    name: 'LLaMA 2',
    endpoint: 'meta-llama/Llama-2-7b-chat-hf',
    type: 'text-generation'
  },
  // Segment Anything tabanlı modeller
  IMAGE_SEGMENTATION: {
    name: 'SAM',
    endpoint: 'facebook/sam-vit-huge',
    type: 'segmentation'
  }
};
