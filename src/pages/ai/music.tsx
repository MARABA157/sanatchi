import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/Layout';
import { Loader2, Play, Pause, Download, Share2, Sparkles, Music2, Waveform } from 'lucide-react';

const MusicPage = () => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(10);
  const [tempo, setTempo] = useState(120);
  const [generating, setGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const generateMusic = async () => {
    if (!prompt || generating) return;

    try {
      setGenerating(true);

      // Ses oluştur
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const sampleRate = audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      const buffer = audioContext.createBuffer(2, frameCount, sampleRate); // Stereo ses için 2 kanal
      const leftChannel = buffer.getChannelData(0);
      const rightChannel = buffer.getChannelData(1);

      // Daha karmaşık bir ses dalgası oluştur
      const beatsPerSecond = tempo / 60;
      const samplesPerBeat = sampleRate / beatsPerSecond;

      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const beat = Math.floor(i / samplesPerBeat);
        
        // Ana frekans (440Hz = A4 notası)
        const mainFreq = 440;
        
        // Harmonikler ekle
        const harmonic1 = Math.sin(2 * Math.PI * mainFreq * t);
        const harmonic2 = Math.sin(2 * Math.PI * mainFreq * 2 * t) * 0.5;
        const harmonic3 = Math.sin(2 * Math.PI * mainFreq * 3 * t) * 0.25;
        
        // Vuruş efekti
        const beatEffect = Math.exp(-5 * (i % samplesPerBeat) / samplesPerBeat);
        
        // Tüm sesleri birleştir
        const sample = (harmonic1 + harmonic2 + harmonic3) * 0.3 * beatEffect;
        
        // Stereo efekti için kanalları hafifçe farklılaştır
        leftChannel[i] = sample * (1 + Math.sin(2 * Math.PI * 0.5 * t) * 0.2);
        rightChannel[i] = sample * (1 - Math.sin(2 * Math.PI * 0.5 * t) * 0.2);
      }

      // Buffer'ı WAV formatına dönüştür
      const wavBuffer = audioBufferToWav(buffer);
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      
      // Önceki URL'i temizle
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setGenerating(false);

    } catch (error) {
      console.error('Müzik oluşturma hatası:', error);
      setGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Yapay Zeka Müzik Stüdyosu
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hayal ettiğiniz müziği yapay zeka ile oluşturun. Tarzınızı, duygularınızı ve vizyonunuzu
            kelimelere dökün, yapay zeka sizin için benzersiz bir müzik parçası üretsin.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="space-y-2">
              <Label htmlFor="prompt">Müzik Açıklaması</Label>
              <Textarea
                id="prompt"
                placeholder="Müziğinizi tanımlayın... Örnek: Sakin ve huzurlu bir piyano melodisi, yağmur sesi eşliğinde..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-32 resize-none"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Süre (saniye)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[duration]}
                    onValueChange={(value) => setDuration(value[0])}
                    min={5}
                    max={30}
                    step={5}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{duration}s</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tempo (BPM)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[tempo]}
                    onValueChange={(value) => setTempo(value[0])}
                    min={60}
                    max={180}
                    step={10}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{tempo}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={generateMusic}
              disabled={generating || !prompt}
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Müzik Oluşturuluyor...
                </>
              ) : (
                <>
                  <Music2 className="mr-2 h-5 w-5" />
                  Müzik Oluştur
                </>
              )}
            </Button>
          </div>

          <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            {audioUrl ? (
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      onClick={togglePlayback}
                      variant="outline"
                      size="lg"
                      className="rounded-full w-16 h-16"
                    >
                      {playing ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8 ml-1" />
                      )}
                    </Button>
                  </div>
                  <Waveform className="w-full h-32 text-gray-300 dark:text-gray-700" />
                </div>

                <audio
                  ref={audioRef}
                  src={audioUrl}
                  className="hidden"
                  onEnded={() => setPlaying(false)}
                />

                <div className="flex gap-4">
                  <a 
                    href={audioUrl}
                    download="ai-music.wav"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-5 w-5" />
                      İndir
                    </Button>
                  </a>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Müzik bağlantısı kopyalandı!');
                    }}
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Paylaş
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <Music2 className="h-16 w-16 mb-4" />
                <p className="text-center">
                  Henüz bir müzik oluşturmadınız. Müzik oluşturmak için sol taraftaki formu doldurun
                  ve "Müzik Oluştur" butonuna tıklayın.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MusicPage;

// AudioBuffer'ı WAV formatına dönüştürme fonksiyonu
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length;
  const sampleRate = buffer.sampleRate;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = length * blockAlign;

  const buffer_ = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer_);

  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write audio data
  const offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      const int = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset + (i * blockAlign) + (channel * bytesPerSample), int, true);
    }
  }

  return buffer_;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
