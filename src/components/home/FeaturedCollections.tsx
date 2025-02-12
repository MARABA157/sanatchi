import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { CollectionCard } from '@/components/collections/CollectionCard';

type Collection = Database['public']['Tables']['collections']['Row'] & {
  user: Database['public']['Tables']['profiles']['Row'] | null;
  artworks: Database['public']['Tables']['artworks']['Row'][];
};

export function FeaturedCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedCollections();
  }, []);

  const fetchFeaturedCollections = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('collections')
        .select('*, user:profiles(*), artworks(*)')
        .eq('is_featured', true)
        .limit(6);

      if (error) throw error;

      setCollections(data || []);
    } catch (error) {
      console.error('Error fetching featured collections:', error);
      toast({
        title: 'Hata',
        description: 'Öne çıkan koleksiyonlar yüklenirken bir hata oluştu',
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

  if (collections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Henüz öne çıkan koleksiyon bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
