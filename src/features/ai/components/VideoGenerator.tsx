import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Video, Download, Loader2, Clock } from 'lucide-react';

interface VideoGeneratorProps {
  onGenerate: (prompt: string, style: string, duration: number) => void;
}

const styles = [
  { value: 'realistic', label: 'Gerçekçi' },
  { value: 'anime', label: 'Anime' },
  { value: '3d', label: '3D Animasyon' },
  { value: 'artistic', label: 'Sanatsal' },
  { value: 'cinematic', label: 'Sinematik' },
];

export function VideoGenerator({ onGenerate }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [duration, setDuration] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt || !style || isGenerating) return;
    
    setIsGenerating(true);
    onGenerate(prompt, style, duration);

    // Simüle edilmiş video oluşturma
    setTimeout(() => {
      setGeneratedVideos((prev) => [
        ...prev,
        'https://example.com/sample-video.mp4',
      ]);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Video Detayları</h2>
        <p className="text-sm text-muted-foreground">
          Oluşturmak istediğiniz videoyu detaylı olarak anlatın
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Açıklama</label>
          <Textarea
            placeholder="Oluşturmak istediğiniz videoyu detaylı olarak anlatın..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-32"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Video Stili</label>
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
          <label className="text-sm font-medium">Video Süresi (saniye)</label>
          <div className="flex items-center gap-4">
            <Slider
              value={[duration]}
              onValueChange={(value) => setDuration(value[0])}
              min={5}
              max={30}
              step={5}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12">{duration}s</span>
          </div>
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
              <Play className="w-4 h-4" />
              Video Oluştur
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Örnek Açıklamalar</h3>
        <div className="space-y-2">
          {[
            "Gün batımında sahilde yürüyen bir kişi, sinematik tarz",
            "Renkli çiçeklerle dolu bir bahçede kelebeklerin dansı",
            "Modern bir şehirde yağmurlu bir gece manzarası",
            "Soyut şekillerin dans ettiği sanatsal bir animasyon",
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

      {/* Oluşturulan Videolar */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Oluşturulan Videolar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {generatedVideos.map((video, index) => (
            <Card key={index} className="relative group">
              <video 
                src={video}
                controls
                className="w-full rounded-lg"
                poster="/video-thumbnail.jpg"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <Button variant="secondary" size="icon">
                  <Play className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {generatedVideos.length === 0 && !isGenerating && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Henüz oluşturulmuş bir video yok
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
