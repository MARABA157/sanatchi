import { useState, useEffect } from 'react';
import { aiServices, ArtworkAnalysis as IArtworkAnalysis } from '@/lib/ai/services';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface Props {
  imageUrl: string;
}

export function ArtworkAnalysis({ imageUrl }: Props) {
  const [analysis, setAnalysis] = useState<IArtworkAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function analyzeArtwork() {
      try {
        const result = await aiServices.analyzeArtwork(imageUrl);
        setAnalysis(result);
      } catch (err) {
        setError('Eser analiz edilirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    analyzeArtwork();
  }, [imageUrl]);

  if (loading) return <div>Analiz yapılıyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!analysis) return null;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Yapay Zeka Analizi</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium">Sanat Stili</h4>
          <p>{analysis.style}</p>
        </div>
        <div>
          <h4 className="font-medium">Dönem</h4>
          <p>{analysis.period}</p>
        </div>
        <div>
          <h4 className="font-medium">Teknik</h4>
          <p>{analysis.technique}</p>
        </div>
        <div>
          <h4 className="font-medium">Renkler</h4>
          <div className="flex gap-2">
            {analysis.colors.map((color) => (
              <span
                key={color}
                className="px-2 py-1 rounded text-sm"
                style={{ backgroundColor: color }}
              >
                {color}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium">Duygu</h4>
          <p>{analysis.mood}</p>
        </div>
        <div>
          <h4 className="font-medium">Konular</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.subjects.map((subject) => (
              <span
                key={subject}
                className="px-2 py-1 bg-muted rounded-full text-sm"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
