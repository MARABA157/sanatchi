import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Music2,
  Wand2,
  Download,
  Share2,
  Save,
  Loader2,
  RefreshCcw,
  Sparkles,
  Volume2,
  Clock,
  Settings2
} from 'lucide-react';

export default function Audio() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [speed, setSpeed] = useState<number>(1.0);
  const [tempo, setTempo] = useState(120);
  const [generating, setGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt || generating) return;
    setGenerating(true);
    
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.generateAudio(prompt, duration, speed);
      setAudioUrl(result.url);
    } catch (error) {
      console.error('Audio generation error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || generating) return;

    setGenerating(true);
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.generateAudio(prompt, duration, speed);
      setAudioUrl(result.url);
    } catch (err) {
      console.error('Error generating audio:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/images/music-bg.jpg')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-black/70 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            {/* Başlık */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30"
              >
                <Music2 className="w-12 h-12 text-white" />
              </motion.div>
              
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                AI Müzik Stüdyosu
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Yapay zeka teknolojisi ile hayalinizdeki müziği oluşturun
              </p>
            </div>

            {/* Ana Panel */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sol Panel - Kontroller */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10"
                >
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <Settings2 className="w-6 h-6 mr-2 text-purple-400" />
                    Müzik Ayarları
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Açıklama */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Müzik Açıklaması
                      </label>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Örnek: Hızlı tempolu, elektronik bir dans müziği..."
                        className="h-32 bg-black/30 border-white/20 text-white placeholder:text-gray-500 resize-none"
                      />
                    </div>

                    {/* Süre ve Hız Kontrolleri */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          Süre (saniye)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="300"
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          Konuşma Hızı
                        </label>
                        <select
                          value={speed}
                          onChange={(e) => setSpeed(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                        >
                          <option value="0.5">Yavaş</option>
                          <option value="1.0">Normal</option>
                          <option value="1.5">Hızlı</option>
                        </select>
                      </div>
                    </div>

                    {/* Tempo */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center">
                        <Volume2 className="w-4 h-4 mr-1 text-purple-400" />
                        Tempo: {tempo} BPM
                      </label>
                      <Slider
                        value={[tempo]}
                        onValueChange={(value) => setTempo(value[0])}
                        max={200}
                        min={60}
                        step={10}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Oluştur Butonu */}
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={!prompt || generating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-lg h-14 shadow-lg shadow-purple-500/30"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Müzik Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      Müzik Oluştur
                    </>
                  )}
                </Button>
              </div>

              {/* Sağ Panel - Önizleme */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 flex flex-col"
              >
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <Music2 className="w-6 h-6 mr-2 text-purple-400" />
                  Müzik Önizleme
                </h2>

                {audioUrl ? (
                  <div className="space-y-6 flex-1">
                    <div className="bg-black/30 rounded-lg p-4">
                      <audio controls className="w-full">
                        <source src={audioUrl} type="audio/mpeg" />
                        Tarayıcınız audio elementini desteklemiyor.
                      </audio>
                    </div>

                    <div className="flex justify-center gap-4">
                      <Button variant="outline" size="lg" className="bg-white/5 hover:bg-white/10 border-white/10 text-white flex-1">
                        <Download className="mr-2 h-5 w-5" />
                        İndir
                      </Button>
                      <Button variant="outline" size="lg" className="bg-white/5 hover:bg-white/10 border-white/10 text-white flex-1">
                        <Share2 className="mr-2 h-5 w-5" />
                        Paylaş
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <Music2 className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-center">
                      Müzik oluşturmak için sol taraftaki ayarları yapın ve
                      "Müzik Oluştur" butonuna tıklayın.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* İpuçları */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
              >
                <Sparkles className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Detaylı Açıklama
                </h3>
                <p className="text-gray-400">
                  Müzik tarzı, enstrümanlar ve duygu durumunu belirtin
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
              >
                <RefreshCcw className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Parametreleri Ayarla
                </h3>
                <p className="text-gray-400">
                  Süre ve tempo ayarlarıyla müziği özelleştirin
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
              >
                <Music2 className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Müzik Türü
                </h3>
                <p className="text-gray-400">
                  Pop, rock, klasik gibi türleri belirtebilirsiniz
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
