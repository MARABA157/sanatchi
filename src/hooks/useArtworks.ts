import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Artwork = Database['public']['Tables']['artworks']['Row'] & {
  user: Database['public']['Tables']['profiles']['Row'] | null;
};

type ArtworkFilters = {
  category?: string;
  style?: string;
  status?: 'pending' | 'approved' | 'rejected';
  userId?: string;
};

export function useArtworks(initialFilters: ArtworkFilters = {}) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ArtworkFilters>(initialFilters);
  const { toast } = useToast();

  useEffect(() => {
    fetchArtworks();
  }, [filters]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError(null);

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

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setArtworks(data || []);
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

  const createArtwork = async (artwork: Database['public']['Tables']['artworks']['Insert']) => {
    try {
      const { data, error } = await supabase.from('artworks').insert(artwork);

      if (error) throw error;

      toast({
        title: 'Başarılı',
        description: 'Eser başarıyla oluşturuldu',
      });

      await fetchArtworks();
      return true;
    } catch (error) {
      console.error('Error creating artwork:', error);
      toast({
        title: 'Hata',
        description: 'Eser oluşturulurken bir hata oluştu',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateArtwork = async (
    id: string,
    artwork: Database['public']['Tables']['artworks']['Update']
  ) => {
    try {
      const { error } = await supabase
        .from('artworks')
        .update(artwork)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Başarılı',
        description: 'Eser başarıyla güncellendi',
      });

      await fetchArtworks();
      return true;
    } catch (error) {
      console.error('Error updating artwork:', error);
      toast({
        title: 'Hata',
        description: 'Eser güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteArtwork = async (id: string) => {
    try {
      const { error } = await supabase.from('artworks').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Başarılı',
        description: 'Eser başarıyla silindi',
      });

      await fetchArtworks();
      return true;
    } catch (error) {
      console.error('Error deleting artwork:', error);
      toast({
        title: 'Hata',
        description: 'Eser silinirken bir hata oluştu',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateFilters = (newFilters: Partial<ArtworkFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    artworks,
    loading,
    error,
    filters,
    updateFilters,
    createArtwork,
    updateArtwork,
    deleteArtwork,
    refetch: fetchArtworks,
  };
}