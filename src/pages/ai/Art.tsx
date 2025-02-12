import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDropzone } from 'react-dropzone';
import {
  Wand2,
  Image as ImageIcon,
  Download,
  Share2,
  Save,
  Loader2,
  Upload,
  RefreshCcw,
  Sparkles,
  Palette
} from 'lucide-react';
import { OpenSourceAI } from '@/services/ai/OpenSourceAI';

export default function AiArt() {
  const [activeTab, setActiveTab] = useState<'generate' | 'style'>('generate');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    steps: 30,
    guidance: 7.5,
    seed: Math.floor(Math.random() * 1000000),
    styleStrength: 0.75
  });

  // Dosya yükleme için dropzone
  const onDropSource = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSourceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const onDropStyle = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStyleImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps: getSourceRootProps, getInputProps: getSourceInputProps } = useDropzone({
    onDrop: onDropSource,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const { getRootProps: getStyleRootProps, getInputProps: getStyleInputProps } = useDropzone({
    onDrop: onDropStyle,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const handleGenerate = async () => {
    if ((!prompt && activeTab === 'generate') || (activeTab === 'style' && !sourceImage)) return;

    setGenerating(true);
    try {
      const ai = OpenSourceAI.getInstance();
      let result;

      if (activeTab === 'generate') {
        result = await ai.generateImage(prompt, {
          negative_prompt: negativePrompt,
          num_inference_steps: settings.steps,
          guidance_scale: settings.guidance,
          seed: settings.seed
        });
      } else {
        if (!sourceImage || !styleImage) return;
        result = await ai.transferStyle(sourceImage, styleImage, settings.styleStrength);
      }

      setResult(result.url);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const regenerate = () => {
    setSettings(prev => ({
      ...prev,
      seed: Math.floor(Math.random() * 1000000)
    }));
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-black/95 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 mb-4">
              AI ile Sanat Üret
            </h1>
            <p className="text-white/60">
              Hayalinizdeki sanat eserini yapay zeka ile oluşturun veya var olan bir resme yeni bir stil kazandırın
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'generate' | 'style')} className="mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="generate">Resim Oluştur</TabsTrigger>
              <TabsTrigger value="style">Stil Transferi</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {activeTab === 'generate' ? (
                <>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-white/80">
                      Ne oluşturmak istiyorsunuz?
                    </label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Örnek: Yağlı boya tarzında gün batımında İstanbul manzarası"
                      className="h-32 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-white/80">
                      İstemediğiniz özellikler (opsiyonel)
                    </label>
                    <Textarea
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="Örnek: bulanık, düşük kalite, çirkin"
                      className="h-20 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-white/80">
                        Adım Sayısı: {settings.steps}
                      </label>
                      <Slider
                        value={[settings.steps]}
                        onValueChange={([value]) => setSettings(prev => ({ ...prev, steps: value }))}
                        min={20}
                        max={50}
                        step={1}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-white/80">
                        Rehberlik Gücü: {settings.guidance}
                      </label>
                      <Slider
                        value={[settings.guidance]}
                        onValueChange={([value]) => setSettings(prev => ({ ...prev, guidance: value }))}
                        min={1}
                        max={20}
                        step={0.5}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-white/80">
                      Kaynak Görsel
                    </label>
                    <div
                      {...getSourceRootProps()}
                      className={`
                        aspect-square rounded-xl border-2 border-dashed
                        ${sourceImage ? 'p-0' : 'p-8'}
                        flex items-center justify-center relative overflow-hidden
                        transition-all duration-300 hover:border-primary/80
                        bg-white/5 border-white/20
                      `}
                    >
                      <input {...getSourceInputProps()} />
                      {sourceImage ? (
                        <img
                          src={sourceImage}
                          alt="Source"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                          <p className="text-white/60">Görsel sürükle veya seç</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-white/80">
                      Stil Görseli
                    </label>
                    <div
                      {...getStyleRootProps()}
                      className={`
                        aspect-square rounded-xl border-2 border-dashed
                        ${styleImage ? 'p-0' : 'p-8'}
                        flex items-center justify-center relative overflow-hidden
                        transition-all duration-300 hover:border-primary/80
                        bg-white/5 border-white/20
                      `}
                    >
                      <input {...getStyleInputProps()} />
                      {styleImage ? (
                        <img
                          src={styleImage}
                          alt="Style"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Palette className="w-12 h-12 text-white/40 mx-auto mb-4" />
                          <p className="text-white/60">Stil görseli sürükle veya seç</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-white/80">
                      Stil Gücü: {settings.styleStrength}
                    </label>
                    <Slider
                      value={[settings.styleStrength]}
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, styleStrength: value }))}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={handleGenerate}
                  disabled={
                    generating || 
                    (activeTab === 'generate' && !prompt) || 
                    (activeTab === 'style' && (!sourceImage || !styleImage))
                  }
                  className="flex-1 h-12"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      {activeTab === 'generate' ? (
                        <>
                          <Wand2 className="w-5 h-5 mr-2" />
                          Oluştur
                        </>
                      ) : (
                        <>
                          <Palette className="w-5 h-5 mr-2" />
                          Stil Uygula
                        </>
                      )}
                    </>
                  )}
                </Button>
                {result && (
                  <Button
                    variant="outline"
                    onClick={regenerate}
                    disabled={generating}
                    className="w-12 h-12 p-0"
                  >
                    <RefreshCcw className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Result Section */}
            <div className="space-y-6">
              <div
                className={`
                  aspect-square rounded-xl border-2 border-dashed
                  ${result ? 'p-0' : 'p-8'}
                  flex items-center justify-center relative overflow-hidden
                  ${generating ? 'animate-pulse' : ''}
                  bg-white/5 border-white/20
                `}
              >
                {result ? (
                  <img
                    src={result}
                    alt="Generated Art"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : generating ? (
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">AI sanatınızı oluşturuyor...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">
                      Oluşturulan eser burada görünecek
                    </p>
                  </div>
                )}
              </div>

              {result && (
                <div className="flex gap-4">
                  <Button className="flex-1">
                    <Download className="w-5 h-5 mr-2" />
                    İndir
                  </Button>
                  <Button className="flex-1">
                    <Save className="w-5 h-5 mr-2" />
                    Galeriye Kaydet
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-5 h-5 mr-2" />
                    Paylaş
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
