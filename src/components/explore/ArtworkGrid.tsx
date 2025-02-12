import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { Database } from '@/types/supabase';

type Artwork = Database['public']['Tables']['artworks']['Row'] & {
  likes_count: number;
  comments_count: number;
  user: {
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
};

interface ArtworkGridProps {
  artworks?: Artwork[];
  loading?: boolean;
  userId?: string;
  limit?: number;
  showLoadMore?: boolean;
}

export function ArtworkGrid({ 
  artworks: propArtworks,
  loading: propLoading,
  userId, 
  limit = 12, 
  showLoadMore = true 
}: ArtworkGridProps) {
  const [artworks, setArtworks] = useState<Artwork[]>(propArtworks || []);
  const [loading, setLoading] = useState(propLoading || !propArtworks);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!propArtworks) {
      void fetchArtworks();
    }
  }, [userId, propArtworks]);

  useEffect(() => {
    if (propArtworks) {
      setArtworks(propArtworks);
      setLoading(false);
    }
  }, [propArtworks]);

  useEffect(() => {
    setLoading(propLoading || false);
  }, [propLoading]);

  const fetchArtworks = async (loadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('artworks')
        .select(`
          *,
          user:profiles(username, full_name, avatar_url),
          likes:likes(count),
          comments:comments(count)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedArtworks = data.map((artwork) => ({
        ...artwork,
        likes_count: artwork.likes?.[0]?.count || 0,
        comments_count: artwork.comments?.[0]?.count || 0,
      }));

      setArtworks(loadMore ? [...artworks, ...formattedArtworks] : formattedArtworks);
      setHasMore(formattedArtworks.length === limit);
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

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    void fetchArtworks(true);
  };

  if (loading && !artworks.length) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <Skeleton
            key={i}
            className="aspect-square rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>{error}</p>
        <Button onClick={() => void fetchArtworks()} variant="outline" className="mt-4">
          Tekrar Dene
        </Button>
      </div>
    );
  }

  if (!artworks.length) {
    return (
      <div className="text-center text-muted-foreground">
        <p>Henüz eser eklenmemiş</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map((artwork) => (
          <Link
            key={artwork.id}
            to={`/artwork/${artwork.id}`}
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
          >
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium truncate">{artwork.title}</h3>
                <p className="text-white/80 text-sm truncate">
                  {artwork.user.full_name}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-white/80 text-sm">
                    {artwork.likes_count} beğeni
                  </span>
                  <span className="text-white/80 text-sm">
                    {artwork.comments_count} yorum
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {showLoadMore && hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            disabled={loading}
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <LoadingSpinner className="mr-2" />
                Yükleniyor...
              </>
            ) : (
              'Daha Fazla'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
