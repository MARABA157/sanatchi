import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { Artwork } from '@/types/artwork';
import { Loader2 } from 'lucide-react';

interface UserArtworksProps {
  userId: string;
}

export function UserArtworks({ userId }: UserArtworksProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const perPage = 12;

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading]);

  useEffect(() => {
    fetchArtworks();
  }, [userId, page]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError(null);

      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const { data, error } = await supabase
        .from('artworks')
        .select('*, user:profiles(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        if (page === 1) {
          setArtworks(data);
        } else {
          setArtworks((prev) => [...prev, ...data]);
        }
        setHasMore(data.length === perPage);
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setError('Eserler yüklenirken bir hata oluştu');
      toast({
        title: 'Hata',
        description: 'Eserler yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setPage(1);
    setHasMore(true);
    fetchArtworks();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={handleRetry} variant="outline">
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {artworks.map((artwork) => (
          <Card key={artwork.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">{artwork.title}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {artwork.description}
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{artwork.category}</span>
                <span>•</span>
                <span>
                  {new Date(artwork.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span>{artwork.likes} beğeni</span>
                <span>{artwork.comments} yorum</span>
                <span>{artwork.views} görüntülenme</span>
              </div>
            </div>
          </Card>
        ))}

        {loading &&
          Array.from({ length: perPage }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
      </div>

      {hasMore && (
        <div
          ref={ref}
          className="flex justify-center p-4"
        >
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!hasMore && artworks.length > 0 && (
        <p className="text-center text-muted-foreground">
          Tüm eserler yüklendi
        </p>
      )}

      {!hasMore && artworks.length === 0 && (
        <p className="text-center text-muted-foreground">
          Henüz eser eklenmemiş
        </p>
      )}
    </div>
  );
}
