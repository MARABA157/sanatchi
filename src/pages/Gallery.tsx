import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import GalleryFilters from '@/components/gallery/GalleryFilters';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { supabase } from '@/lib/supabase';
import { Artwork, Categories } from '@/types/artwork';
import { useToast } from '@/components/ui/use-toast';

export default function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchArtworks();
  }, [selectedCategory]);

  const fetchArtworks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('artworks')
        .select('*, user:users(id, username, full_name, avatar_url)');

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      setArtworks(data as Artwork[]);
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Hata',
        description: 'Eserler yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={fetchArtworks} />;
  }

  return (
    <>
      <Helmet>
        <title>Galeri | Sanat</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Galeri</h1>
        <GalleryFilters onCategoryChange={setSelectedCategory} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{artwork.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{artwork.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Sanatçı: {artwork.user.full_name || artwork.user.username}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
