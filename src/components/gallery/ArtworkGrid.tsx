import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { ArtworkCard } from './ArtworkCard';
import { ArtworkFilter } from '@/types/filters';

type Artwork = Database['public']['Tables']['artworks']['Row'] & {
  user: Database['public']['Tables']['profiles']['Row'] | null;
};

interface ArtworkGridProps {
  filters: ArtworkFilter;
  onFilterChange: (filters: Partial<ArtworkFilter>) => void;
}

export function ArtworkGrid({ filters, onFilterChange }: ArtworkGridProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArtworks();
  }, [filters]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('artworks')
        .select('*, user:profiles(*)')
        .order('created_at', { ascending: false });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.style) {
        query = query.eq('style', filters.style);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.isForSale !== undefined) {
        query = query.eq('is_for_sale', filters.isForSale);
      }

      if (filters.sort) {
        const [column, order] = filters.sort.split('.');
        query = query.order(column, { ascending: order === 'asc' });
      }

      const { data, error } = await query;

      if (error) throw error;

      setArtworks(data || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      toast({
        title: 'Hata',
        description: 'Eserler yüklenirken bir hata oluştu',
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
          Bu kriterlere uygun eser bulunamadı.
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