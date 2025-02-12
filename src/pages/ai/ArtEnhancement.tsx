import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Wand2, Image as ImageIcon, RefreshCcw, Download, Loader2 } from 'lucide-react';

const artStyles = [
  { id: 'vangogh', name: 'Van Gogh', preview: '/styles/vangogh.jpg' },
  { id: 'monet', name: 'Monet', preview: '/styles/monet.jpg' },
  { id: 'picasso', name: 'Picasso', preview: '/styles/picasso.jpg' },
  { id: 'kandinsky', name: 'Kandinsky', preview: '/styles/kandinsky.jpg' },
  { id: 'davinci', name: 'Da Vinci', preview: '/styles/davinci.jpg' },
];

export default function ArtEnhancement() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('style-transfer');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [styleStrength, setStyleStrength] = useState(50);
  const [processing, setProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: handleImageDrop
  });

  async function handleImageDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function processImage() {
    if (!originalImage) {
      toast({
        title: "Hata",
        description: "Lütfen bir resim yükleyin",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      // Burada AI işleme mantığı eklenecek
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simüle edilmiş işlem
      
      // Simüle edilmiş sonuç
      setProcessedImage(originalImage);
      
      toast({
        title: "Başarılı",
        description: selectedTab === 'style-transfer' 
          ? "Stil transferi tamamlandı" 
          : "Restorasyon tamamlandı",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  }

  function downloadImage() {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'enhanced-artwork.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">AI Sanat Geliştirme</h1>
          <p className="text-muted-foreground">
            Resimlerinizi yapay zeka ile dönüştürün ve geliştirin
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 w-[400px] mx-auto">
            <TabsTrigger value="style-transfer">Stil Transferi</TabsTrigger>
            <TabsTrigger value="restoration">Restorasyon</TabsTrigger>
          </TabsList>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Sol Panel - Kontroller */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                    <input {...getInputProps()} />
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Resmi sürükleyin veya seçin
                    </p>
                  </div>
                </CardContent>
              </Card>

              {selectedTab === 'style-transfer' && (
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Stil Seçimi</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {artStyles.map((style) => (
                        <div
                          key={style.id}
                          className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${
                            selectedStyle === style.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedStyle(style.id)}
                        >
                          <img
                            src={style.preview}
                            alt={style.name}
                            className="w-full aspect-square object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {style.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Stil Gücü: {styleStrength}%
                      </label>
                      <Slider
                        value={[styleStrength]}
                        onValueChange={([value]) => setStyleStrength(value)}
                        max={100}
                        step={1}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-4">
                <Button
                  className="flex-1"
                  onClick={processImage}
                  disabled={!originalImage || processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      {selectedTab === 'style-transfer' ? 'Stil Uygula' : 'Restore Et'}
                    </>
                  )}
                </Button>
                {processedImage && (
                  <Button variant="outline" onClick={downloadImage}>
                    <Download className="w-4 h-4 mr-2" />
                    İndir
                  </Button>
                )}
              </div>
            </div>

            {/* Sağ Panel - Önizleme */}
            <div className="space-y-6">
              {originalImage && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Orijinal</h3>
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {processedImage && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {selectedTab === 'style-transfer' ? 'Stilize Edilmiş' : 'Restore Edilmiş'}
                    </h3>
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}
