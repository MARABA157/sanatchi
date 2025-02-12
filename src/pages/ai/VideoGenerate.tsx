import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Video,
  Upload,
  Wand2,
  Download,
  Share2,
  Save,
  Loader2,
  Clock,
  Film,
  Music,
  Settings
} from 'lucide-react';
import { OpenSourceAI } from '@/services/ai/OpenSourceAI';

export default function VideoGenerate() {
  const [prompt, setPrompt] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  
  const [settings, setSettings] = useState({
    duration: 10,
    fps: 30,
    quality: 'high',
    style: 'cinematic'
  });

  const STYLES = [
    { id: 'cinematic', name: 'Sinematik' },
    { id: 'anime', name: 'Anime' },
    { id: '3d', name: '3D Animasyon' },
    { id: 'realistic', name: 'Gerçekçi' },
    { id: 'artistic', name: 'Sanatsal' }
  ];

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;

    setGenerating(true);
    setProgress(0);

    try {
      // Simüle edilmiş ilerleme
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 500);

      // Burada gerçek video üretimi yapılacak
      await new Promise(resolve => setTimeout(resolve, 5000));
      setResult('https://example.com/generated-video.mp4');

      clearInterval(interval);
    } catch (error) {
      console.error('Video generation error:', error);
    } finally {
      setGenerating(false);
      setProgress(100);
    }
  };

  return (
    <div className="min-h-screen bg-black/95 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 mb-4">
              AI Video Oluştur
            </h1>
            <p className="text-white/60">
              Metinden video oluşturun veya müziğinize video üretin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white/80">
                  Video İçeriği
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Videonuzda ne olmasını istiyorsunuz?"
                  className="h-32 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-white/80">
                  Müzik (Opsiyonel)
                </label>
                <div className="flex gap-4">
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('audio-upload')?.click()}
                    className="flex-1"
                  >
                    <Music className="w-5 h-5 mr-2" />
                    {audioFile ? audioFile.name : 'Müzik Seç'}
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-white/80">
                    Video Uzunluğu: {settings.duration} saniye
                  </label>
                  <Slider
                    value={[settings.duration]}
                    onValueChange={([value]) => setSettings(prev => ({ ...prev, duration: value }))}
                    min={5}
                    max={60}
                    step={5}
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-white/80">
                    Video Stili
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {STYLES.map(style => (
                      <Button
                        key={style.id}
                        variant={settings.style === style.id ? 'default' : 'outline'}
                        onClick={() => setSettings(prev => ({ ...prev, style: style.id }))}
                        className="w-full"
                      >
                        {style.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!prompt || generating}
                  className="w-full h-12"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Oluşturuluyor... {progress}%
                    </>
                  ) : (
                    <>
                      <Film className="w-5 h-5 mr-2" />
                      Video Oluştur
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <div
                className={`
                  aspect-video rounded-xl border-2 border-dashed
                  ${result ? 'p-0' : 'p-8'}
                  flex items-center justify-center relative overflow-hidden
                  ${generating ? 'animate-pulse' : ''}
                  bg-white/5 border-white/20
                `}
              >
                {result ? (
                  <video
                    src={result}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : generating ? (
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-white/40 mx-auto mb-4 animate-spin" />
                    <p className="text-white/60">Video oluşturuluyor...</p>
                    <p className="text-white/40 text-sm mt-2">
                      Bu işlem birkaç dakika sürebilir
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Video className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">
                      Oluşturulan video burada görünecek
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

              {generating && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white/80 font-medium mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    İşlem Aşamaları
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Prompt Analizi</span>
                      <span className="text-white/80">Tamamlandı</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Kare Oluşturma</span>
                      <span className="text-white/80">{Math.min(progress, 60)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Video Birleştirme</span>
                      <span className="text-white/80">
                        {progress > 60 ? `${Math.min((progress - 60) * 2.5, 100)}%` : 'Bekliyor'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
