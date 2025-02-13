import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Music,
  Mic,
  WaveformIcon,
  Download,
  Share2,
  Save,
  Loader2,
  RefreshCcw,
  Volume2,
  Play,
  Pause
} from 'lucide-react';
import { OpenSourceAI } from '@/services/ai/OpenSourceAI';

const AUDIO_TYPES = [
  { id: 'music', name: 'Müzik', icon: Music },
  { id: 'speech', name: 'Konuşma', icon: Mic },
  { id: 'sound', name: 'Ses Efekti', icon: Volume2 }
];

const MUSIC_STYLES = [
  { id: 'classical', name: 'Klasik' },
  { id: 'electronic', name: 'Elektronik' },
  { id: 'rock', name: 'Rock' },
  { id: 'jazz', name: 'Jazz' },
  { id: 'ambient', name: 'Ambient' }
];

const VOICE_STYLES = [
  { id: 'natural', name: 'Doğal' },
  { id: 'emotional', name: 'Duygusal' },
  { id: 'robotic', name: 'Robotik' }
];

export default function AiAudio() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'music' | 'speech' | 'sound'>('music');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedModel, setSelectedModel] = useState('musicgen');
  const [selectedStyle, setSelectedStyle] = useState(MUSIC_STYLES[0].id);

  const [settings, setSettings] = useState({
    duration: 10,
    tempo: 120,
    intensity: 0.7
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

    setGenerating(true);
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.generateAudio(prompt, {
        model: selectedModel as any,
        duration: settings.duration,
        type: activeTab
      });

      setResult(result.url);
      toast({
        title: "Başarılı!",
        description: "Ses başarıyla oluşturuldu",
      });
    } catch (error: any) {
      toast({
        title: "Hata!",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const togglePlay = () => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-black/95 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 mb-4">
              AI ile Ses Oluştur
            </h1>
            <p className="text-white/60">
              Yapay zeka ile müzik, konuşma ve ses efektleri oluşturun
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              {AUDIO_TYPES.map(type => (
                <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-2">
                  <type.icon className="w-4 h-4" />
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white/80">
                  Model Seçin
                </label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="musicgen">MusicGen (Meta)</SelectItem>
                    <SelectItem value="audiocraft">AudioCraft (Meta)</SelectItem>
                    <SelectItem value="bark">Bark (Suno)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-white/80">
                  Ne oluşturmak istiyorsunuz?
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    activeTab === 'music'
                      ? "Örnek: Hızlı tempolu, elektronik dans müziği, enerjik ritimler ve sentetik sesler"
                      : activeTab === 'speech'
                      ? "Örnek: Doğal bir ses tonuyla, heyecanlı bir şekilde haberleri sunan spiker"
                      : "Örnek: Yağmur ve gök gürültüsü sesi, arka planda hafif rüzgar"
                  }
                  className="h-32 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              {activeTab === 'music' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-white/80">
                    Müzik Stili
                  </label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MUSIC_STYLES.map(style => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === 'speech' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-white/80">
                    Ses Tonu
                  </label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VOICE_STYLES.map(style => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-white/80">
                    Süre: {settings.duration} saniye
                  </label>
                  <Slider
                    value={[settings.duration]}
                    onValueChange={([value]) => setSettings(prev => ({ ...prev, duration: value }))}
                    min={5}
                    max={60}
                    step={5}
                  />
                </div>

                {activeTab === 'music' && (
                  <>
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-white/80">
                        Tempo: {settings.tempo} BPM
                      </label>
                      <Slider
                        value={[settings.tempo]}
                        onValueChange={([value]) => setSettings(prev => ({ ...prev, tempo: value }))}
                        min={60}
                        max={200}
                        step={1}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-white/80">
                        Yoğunluk: {Math.round(settings.intensity * 100)}%
                      </label>
                      <Slider
                        value={[settings.intensity]}
                        onValueChange={([value]) => setSettings(prev => ({ ...prev, intensity: value }))}
                        min={0}
                        max={1}
                        step={0.1}
                      />
                    </div>
                  </>
                )}
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4 mr-2" />
                    Oluştur
                  </>
                )}
              </Button>
            </div>

            {/* Preview Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Önizleme</h2>
              
              {result ? (
                <div className="space-y-4">
                  <div className="aspect-[3/1] bg-black/50 rounded-lg flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white" />
                        )}
                      </button>
                    </div>
                    
                    <audio
                      id="audio-player"
                      src={result}
                      className="hidden"
                      onEnded={() => setIsPlaying(false)}
                    />

                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      İndir
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Paylaş
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Kaydet
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/1] bg-black/50 rounded-lg flex items-center justify-center">
                  <p className="text-white/40">
                    Oluşturulan ses burada görüntülenecek
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
