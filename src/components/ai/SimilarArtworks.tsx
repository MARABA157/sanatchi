import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aiServices, SimilarArtwork } from '@/lib/ai/services';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface Props {
  artworkId: string;
}

export function SimilarArtworks({ artworkId }: Props) {
  const [artworks, setArtworks] = useState<SimilarArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function findSimilarArtworks() {
      try {
        const result = await aiServices.findSimilarArtworks(artworkId);
        setArtworks(result);
      } catch (err) {
        setError('Benzer eserler bulunurken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    findSimilarArtworks();
  }, [artworkId]);

  if (loading) return <div>Benzer eserler aranıyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (artworks.length === 0) return <div>Benzer eser bulunamadı</div>;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Benzer Eserler</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {artworks.map((artwork) => (
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
      </CardContent>
    </Card>
  );
}
