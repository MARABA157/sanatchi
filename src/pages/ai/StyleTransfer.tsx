import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Upload,
  Image as ImageIcon,
  Wand2,
  Download,
  Share2,
  Save,
  Loader2
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { Database } from '@/types/database.types';

type AIStyle = Database['public']['Tables']['ai_styles']['Row'];

export default function StyleTransfer() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<AIStyle | null>(null);
  const [styleStrength, setStyleStrength] = useState(0.75);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSourceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const handleStyleTransfer = async () => {
    if (!sourceImage || !selectedStyle) return;

    setIsProcessing(true);
    try {
      // Burada AI stil transfer API'si çağrılacak
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simüle edilmiş işlem
      setResult('https://images.pexels.com/photos/1647116/pexels-photo-1647116.jpeg');
    } catch (error) {
      console.error('Style transfer error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/95 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 mb-4">
              AI Stil Transferi
            </h1>
            <p className="text-white/60">
              Fotoğraflarınıza ünlü sanat eserlerinin stilini uygulayın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Source Image */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Kaynak Görsel</h2>
              
              <div
                {...getRootProps()}
                className={`
                  aspect-square rounded-xl border-2 border-dashed
                  ${isDragActive ? 'border-primary' : 'border-white/20'}
                  ${sourceImage ? 'p-0' : 'p-8'}
                  flex items-center justify-center relative overflow-hidden
                  transition-all duration-300 hover:border-primary/80
                `}
              >
                <input {...getInputProps()} />
                {sourceImage ? (
                  <img
                    src={sourceImage}
                    alt="Source"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">
                      {isDragActive ? 
                        'Bırak...' : 
                        'Görsel sürükle veya seç'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Stil Seç</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {[1,2,3,4].map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle({ id: style.toString() } as AIStyle)}
                    className={`
                      aspect-square rounded-xl overflow-hidden relative group
                      ${selectedStyle?.id === style.toString() ? 'ring-2 ring-primary' : ''}
                    `}
                  >
                    <img
                      src={`https://picsum.photos/400?random=${style}`}
                      alt={`Style ${style}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium">Stil {style}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Style Strength */}
              <div className="space-y-4">
                <label className="text-white/80 text-sm">Stil Gücü</label>
                <Slider
                  value={[styleStrength]}
                  onValueChange={([value]) => setStyleStrength(value)}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Zayıf</span>
                  <span>Güçlü</span>
                </div>
              </div>

              {/* Process Button */}
              <Button
                onClick={handleStyleTransfer}
                disabled={!sourceImage || !selectedStyle || isProcessing}
                className="w-full h-12"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Stili Uygula
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Sonuç</h2>
              
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-white/5">
                <img
                  src={result}
                  alt="Result"
                  className="w-full h-full object-cover"
                />
              </div>

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
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
