import { useState } from 'react';
import { Link } from 'react-router-dom';
import { aiServices, SimilarArtwork } from '@/lib/ai/services';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ImageSearch() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [results, setResults] = useState<SimilarArtwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSearch = async () => {
    if (!imageUrl) return;

    setLoading(true);
    setError(null);

    try {
      const result = await aiServices.searchByImage(imageUrl);
      setResults(result);
    } catch (err) {
      setError('Görsel arama yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Görsel Arama</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button variant="outline" className="w-full" asChild>
              <span>Görsel Seç</span>
            </Button>
          </label>
          {imageUrl && (
            <div className="relative aspect-video">
              <img
                src={imageUrl}
                alt="Seçilen görsel"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <Button
            onClick={handleSearch}
            disabled={!imageUrl || loading}
            className="w-full"
          >
            {loading ? 'Aranıyor...' : 'Ara'}
          </Button>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((artwork) => (
              <Link key={artwork.id} to={`/artwork/${artwork.id}`}>
                <div className="group relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h4 className="font-medium">{artwork.title}</h4>
                      <p className="text-sm">{artwork.artist}</p>
                      <p className="text-sm">Benzerlik: %{Math.round(artwork.similarity_score * 100)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
