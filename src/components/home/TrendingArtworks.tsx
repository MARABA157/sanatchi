import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { ArtworkCard } from '@/components/gallery/ArtworkCard';

type Artwork = Database['public']['Tables']['artworks']['Row'] & {
  user: Database['public']['Tables']['profiles']['Row'] | null;
};

export function TrendingArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrendingArtworks();
  }, []);

  const fetchTrendingArtworks = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('artworks')
        .select('*, user:profiles(*)')
        .order('views_count', { ascending: false })
        .limit(6);

      if (error) throw error;

      setArtworks(data || []);
    } catch (error) {
      console.error('Error fetching trending artworks:', error);
      toast({
        title: 'Hata',
        description: 'Trend eserler yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[300px] rounded-lg bg-gray-100 animate-pulse dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Henüz trend eser bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
