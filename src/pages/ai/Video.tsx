import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, Share2, Sparkles } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

const VIDEO_STYLES = [
  { id: 'cinematic', name: 'Sinematik' },
  { id: 'anime', name: 'Anime' },
  { id: '3d', name: '3D Animasyon' },
  { id: 'realistic', name: 'Gerçekçi' },
  { id: 'cartoon', name: 'Çizgi Film' },
  { id: 'neural', name: 'Yapay Sinir Ağı' }
];

const CANVAS_SIZE = 512;
const FPS = 24;

export default function AiVideo() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(VIDEO_STYLES[0].id);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function createModel() {
      try {
        const model = tf.sequential();
        
        model.add(tf.layers.dense({
          inputShape: [2],
          units: 32,
          activation: 'relu'
        }));
        
        model.add(tf.layers.dense({
          units: 16,
          activation: 'relu'
        }));
        
        model.add(tf.layers.dense({
          units: 3,
          activation: 'sigmoid'
        }));

        model.compile({
          optimizer: 'adam',
          loss: 'meanSquaredError'
        });

        setModel(model);
      } catch (error) {
        console.error('Model oluşturma hatası:', error);
      }
    }

    createModel();
  }, []);

  const generateNeuralColor = async (x: number, y: number) => {
    if (!model) return { r: 0, g: 0, b: 0 };

    try {
      const input = tf.tensor2d([[x, y]]);
      const prediction = model.predict(input) as tf.Tensor;
      const [r, g, b] = await prediction.data();
      input.dispose();
      prediction.dispose();
      return { r: r * 255, g: g * 255, b: b * 255 };
    } catch (error) {
      console.error('Renk üretme hatası:', error);
      return { r: 0, g: 0, b: 0 };
    }
  };

  const generateVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const chunks: Blob[] = [];
    const stream = canvas.captureStream(FPS);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    return new Promise<string>((resolve, reject) => {
      let frameCount = 0;
      const totalFrames = FPS * 3;

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        resolve(url);
      };

      mediaRecorder.onerror = (event) => {
        reject(new Error('Video kaydı sırasında hata oluştu'));
      };

      mediaRecorder.start(1000 / FPS);

      const animate = async () => {
        if (frameCount >= totalFrames) {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        const time = frameCount * 0.05;

        if (selectedStyle === 'neural' && model) {
          const imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
          
          for (let x = 0; x < CANVAS_SIZE; x += 4) {
            for (let y = 0; y < CANVAS_SIZE; y += 4) {
              const normalizedX = (x / CANVAS_SIZE) * 2 - 1 + Math.sin(time);
              const normalizedY = (y / CANVAS_SIZE) * 2 - 1 + Math.cos(time);
              
              const color = await generateNeuralColor(normalizedX, normalizedY);
              
              for (let dx = 0; dx < 4; dx++) {
                for (let dy = 0; dy < 4; dy++) {
                  const idx = ((y + dy) * CANVAS_SIZE + (x + dx)) * 4;
                  imageData.data[idx] = color.r;
                  imageData.data[idx + 1] = color.g;
                  imageData.data[idx + 2] = color.b;
                  imageData.data[idx + 3] = 255;
                }
              }
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
        } else {
          const particleCount = 100;
          for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2 + time;
            const radius = 150 + Math.sin(time * 2 + i) * 50;
            const x = Math.cos(angle) * radius + CANVAS_SIZE/2;
            const y = Math.sin(angle) * radius + CANVAS_SIZE/2;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${(angle * 180 / Math.PI + time * 50) % 360}, 70%, 50%)`;
            ctx.fill();
            
            if (i > 0) {
              const prevAngle = ((i - 1) / particleCount) * Math.PI * 2 + time;
              const prevRadius = 150 + Math.sin(time * 2 + i - 1) * 50;
              const prevX = Math.cos(prevAngle) * prevRadius + CANVAS_SIZE/2;
              const prevY = Math.sin(prevAngle) * prevRadius + CANVAS_SIZE/2;
              
              ctx.beginPath();
              ctx.moveTo(prevX, prevY);
              ctx.lineTo(x, y);
              ctx.strokeStyle = `hsla(${(angle * 180 / Math.PI + time * 50) % 360}, 70%, 50%, 0.3)`;
              ctx.stroke();
            }
          }
        }

        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 20;
        
        const scale = 1 + Math.sin(time) * 0.1;
        ctx.translate(CANVAS_SIZE/2, CANVAS_SIZE/2);
        ctx.scale(scale, scale);
        ctx.rotate(Math.sin(time * 0.5) * 0.1);
        
        const lines = prompt.split('\n');
        const lineHeight = 60;
        lines.forEach((line, i) => {
          const y = (i - (lines.length - 1) / 2) * lineHeight;
          ctx.fillText(line, 0, y);
        });
        
        ctx.restore();

        frameCount++;
        requestAnimationFrame(animate);
      };

      animate();
    });
  };

  const handleGenerate = async () => {
    if (!prompt || generating) return;

    try {
      setGenerating(true);
      setError(null);

      console.log("Video oluşturma başlatılıyor...");
      const videoUrl = await generateVideo();
      
      if (videoUrl) {
        console.log("Video başarıyla oluşturuldu");
        setResult(videoUrl);
      } else {
        throw new Error("Video oluşturulamadı");
      }

    } catch (error: any) {
      console.error('Video oluşturma hatası:', error);
      setError(error.message || 'Video oluşturulurken bir hata oluştu');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Yapay Zeka Video Oluşturucu</h1>
      
      <canvas 
        ref={canvasRef} 
        width={CANVAS_SIZE} 
        height={CANVAS_SIZE} 
        className="hidden"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Textarea
            placeholder="Videonuz için bir açıklama yazın..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-32"
          />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Video Stili</label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_STYLES.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !prompt}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Video Oluştur
              </>
            )}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {result && (
            <div className="rounded-lg overflow-hidden bg-gray-100 p-4">
              <div className="aspect-square relative">
                <video
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                  src={result}
                >
                  <source src={result} type="video/webm" />
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              </div>
              <div className="flex gap-2 mt-4">
                <a 
                  href={result} 
                  download="ai-video.webm"
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
                    const videoElement = document.createElement('video');
                    videoElement.src = result;
                    videoElement.controls = true;
                    const shareData = {
                      title: 'AI Video',
                      text: prompt,
                      files: [
                        new File([videoElement], 'ai-video.webm', {
                          type: 'video/webm',
                        }),
                      ],
                    };
                    if (navigator.share && navigator.canShare(shareData)) {
                      navigator.share(shareData);
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Video bağlantısı kopyalandı!');
                    }
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
