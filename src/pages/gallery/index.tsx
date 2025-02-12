import { ArtworkCard } from '@/components/gallery/ArtworkCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    async function fetchArtworks() {
      const { data } = await supabase.from('artworks').select('*');
      if (data) {
        setArtworks(data);
      }
    }
    fetchArtworks();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Sanat Galerisi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
}
