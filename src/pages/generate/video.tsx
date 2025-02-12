import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Video, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

// Açık kaynaklı video modelleri
const OPEN_SOURCE_MODELS = [
  {
    id: 'modelscope',
    name: 'ModelScope Text-to-Video',
    description: 'ModelScope tarafından geliştirilen açık kaynaklı metin-video dönüşüm modeli',
    endpoint: 'https://api.modelscope.cn/sample/text-to-video/1.0'
  },
  {
    id: 'zeroscope',
    name: 'ZeroScope',
    description: 'Stability AI tarafından geliştirilen açık kaynaklı video üretim modeli',
    endpoint: 'https://api.zeroscope.ai/generate'
  },
  {
    id: 'animov',
    name: 'Animov',
    description: 'Açık kaynaklı anime tarzı video üretim modeli',
    endpoint: 'https://api.animov.org/generate'
  }
];

export default function GenerateVideo() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(OPEN_SOURCE_MODELS[0].id);
  const [stylePreset, setStylePreset] = useState('');
  const [referenceVideo, setReferenceVideo] = useState<File | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.webm']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setReferenceVideo(acceptedFiles[0]);
    }
  });

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Hata",
        description: "Lütfen bir açıklama girin",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const selectedModelConfig = OPEN_SOURCE_MODELS.find(m => m.id === selectedModel);
      
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('model', selectedModel);
      if (stylePreset) formData.append('style', stylePreset);
      if (referenceVideo) formData.append('reference', referenceVideo);

      const response = await fetch(selectedModelConfig!.endpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Video oluşturma başarısız oldu');

      const data = await response.json();
      setGeneratedVideo(data.videoUrl);

      toast({
        title: "Başarılı!",
        description: "Video başarıyla oluşturuldu",
      });
    } catch (error: any) {
      toast({
        title: "Hata!",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
            Video Oluştur
          </h1>
          <p className="text-white/60">
            Açık kaynaklı yapay zeka modelleri ile yaratıcı videolar oluşturun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            {/* Model Seçimi */}
            <div className="space-y-2">
              <Label className="text-white">Model Seçin</Label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                {OPEN_SOURCE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-white/40">
                {OPEN_SOURCE_MODELS.find(m => m.id === selectedModel)?.description}
              </p>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <Label className="text-white">Video Açıklaması</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Videoda görmek istediğiniz şeyleri detaylı bir şekilde açıklayın..."
                className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            {/* Style Preset */}
            <div className="space-y-2">
              <Label className="text-white">Stil (Opsiyonel)</Label>
              <Input
                value={stylePreset}
                onChange={(e) => setStylePreset(e.target.value)}
                placeholder="Örn: anime, sinematik, gerçekçi..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            {/* Referans Video */}
            <div className="space-y-2">
              <Label className="text-white">Referans Video (Opsiyonel)</Label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-white/10 rounded-lg p-6 cursor-pointer hover:border-white/20 transition-colors"
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-2 text-white/60">
                  <Upload className="w-8 h-8" />
                  <p>Video yüklemek için tıklayın veya sürükleyin</p>
                  {referenceVideo && (
                    <p className="text-sm text-white/80">{referenceVideo.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Video Oluşturuluyor...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Video Oluştur
                </>
              )}
            </Button>
          </div>

          {/* Preview */}
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Önizleme</h2>
            {generatedVideo ? (
              <video
                src={generatedVideo}
                controls
                className="w-full rounded-lg"
              />
            ) : (
              <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
                <p className="text-white/40">
                  Oluşturulan video burada görüntülenecek
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
