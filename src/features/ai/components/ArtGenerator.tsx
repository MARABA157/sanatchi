import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Image as ImageIcon, Download, Loader2 } from 'lucide-react';

interface ArtGeneratorProps {
  onGenerate: (prompt: string, style: string, aspectRatio: string) => void;
}

const styles = [
  { value: 'realistic', label: 'Gerçekçi' },
  { value: 'impressionist', label: 'Empresyonist' },
  { value: 'abstract', label: 'Soyut' },
  { value: 'surrealist', label: 'Sürrealist' },
  { value: 'pop-art', label: 'Pop Art' },
  { value: 'minimalist', label: 'Minimalist' },
];

const aspectRatios = [
  { value: '1:1', label: 'Kare (1:1)' },
  { value: '3:4', label: 'Portre (3:4)' },
  { value: '4:3', label: 'Manzara (4:3)' },
  { value: '16:9', label: 'Geniş (16:9)' },
];

export function ArtGenerator({ onGenerate }: ArtGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt || !style || isGenerating) return;
    
    setIsGenerating(true);
    onGenerate(prompt, style, aspectRatio);

    // Simüle edilmiş görsel oluşturma
    setTimeout(() => {
      setGeneratedImages((prev) => [
        ...prev,
        'https://source.unsplash.com/random/800x800?art',
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Sanat Eseri Detayları</h2>
        <p className="text-sm text-muted-foreground">
          Oluşturmak istediğiniz sanat eserini detaylı olarak anlatın
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Açıklama</label>
          <Textarea
            placeholder="Oluşturmak istediğiniz sanat eserini detaylı olarak anlatın..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-32"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sanat Stili</label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Bir stil seçin" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">En Boy Oranı</label>
          <Select value={aspectRatio} onValueChange={setAspectRatio}>
            <SelectTrigger>
              <SelectValue placeholder="En boy oranı seçin" />
            </SelectTrigger>
            <SelectContent>
              {aspectRatios.map((ratio) => (
                <SelectItem key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full gap-2" 
          size="lg"
          onClick={handleGenerate}
          disabled={!prompt || !style || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Oluşturuluyor...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Sanat Eseri Oluştur
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Örnek Açıklamalar</h3>
        <div className="space-y-2">
          {[
            "Gün batımında lavanta tarlası, empresyonist stil",
            "Modern şehir manzarası, minimalist yaklaşım",
            "Okyanus dalgaları arasında dans eden balinalar, sürrealist",
            "Sonbahar ormanında yürüyen figür, gerçekçi tarz",
          ].map((example, index) => (
            <Card 
              key={index}
              className="p-3 hover:bg-muted/50 cursor-pointer transition-colors text-sm"
              onClick={() => setPrompt(example)}
            >
              {example}
            </Card>
          ))}
        </div>
      </div>

      {/* Oluşturulan Görseller */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Oluşturulan Eserler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {generatedImages.map((image, index) => (
            <Card key={index} className="relative group">
              <img
                src={image}
                alt={`Generated Art ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button variant="secondary" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {generatedImages.length === 0 && !isGenerating && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Henüz oluşturulmuş bir eser yok
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
