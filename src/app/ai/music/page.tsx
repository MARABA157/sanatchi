'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Play, Pause, Download, Share2, Sparkles } from 'lucide-react';

export default function MusicPage() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const generateMusic = async () => {
    if (!prompt || generating) return;

    try {
      setGenerating(true);

      // Ses oluştur
      const audioContext = new window.AudioContext();
      const duration = 4; // saniye
      const sampleRate = audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
      const channel = buffer.getChannelData(0);

      // Basit bir sinüs dalgası oluştur
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        channel[i] = Math.sin(440 * t * 2 * Math.PI) * 0.5;
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
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Yapay Zeka Müzik Oluşturucu</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Textarea
            placeholder="Müziğiniz için bir açıklama yazın..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-32"
          />

          <div className="flex gap-2">
            <Button
              onClick={generateMusic}
              disabled={generating || !prompt}
              className="flex-1"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Müzik Oluştur
                </>
              )}
            </Button>

            {audioUrl && (
              <Button
                onClick={togglePlayback}
                variant="outline"
                className="w-24"
              >
                {playing ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Durdur
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Oynat
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {audioUrl && (
            <div className="rounded-lg overflow-hidden bg-gray-100 p-4">
              <audio
                ref={audioRef}
                controls
                src={audioUrl}
                className="w-full"
                onEnded={() => setPlaying(false)}
              />
              <div className="flex gap-2 mt-4">
                <a 
                  href={audioUrl} 
                  download="ai-music.wav"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
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
                  <Share2 className="mr-2 h-4 w-4" />
                  Paylaş
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
