import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aiServices, ArtistRecommendation } from '@/lib/ai/services';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface Props {
  userId: string;
}

export function ArtistRecommendations({ userId }: Props) {
  const [artists, setArtists] = useState<ArtistRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getRecommendations() {
      try {
        const result = await aiServices.recommendArtists(userId);
        setArtists(result);
      } catch (err) {
        setError('Sanatçı önerileri alınırken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    getRecommendations();
  }, [userId]);

  if (loading) return <div>Öneriler yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (artists.length === 0) return <div>Öneri bulunamadı</div>;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Size Özel Sanatçı Önerileri</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {artists.map((artist) => (
            <Link key={artist.id} to={`/artist/${artist.id}`}>
              <div className="group relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={artist.image_url}
                  alt={artist.name}
                  className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h4 className="font-medium">{artist.name}</h4>
                    <p className="text-sm">{artist.style}</p>
                    <p className="text-sm">{artist.period}</p>
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
