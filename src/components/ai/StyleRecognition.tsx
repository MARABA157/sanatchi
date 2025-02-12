import { useState, useEffect } from 'react';
import { aiServices } from '@/lib/ai/services';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface Props {
  imageUrl: string;
}

export function StyleRecognition({ imageUrl }: Props) {
  const [styles, setStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function recognizeStyle() {
      try {
        const result = await aiServices.recognizeStyle(imageUrl);
        setStyles(result);
      } catch (err) {
        setError('Sanat stili tanınırken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    recognizeStyle();
  }, [imageUrl]);

  if (loading) return <div>Stil analizi yapılıyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (styles.length === 0) return <div>Stil tanımlanamadı</div>;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Sanat Stilleri</h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {styles.map((style) => (
            <span
              key={style}
              className="px-3 py-1 bg-primary/10 rounded-full text-sm"
            >
              {style}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
