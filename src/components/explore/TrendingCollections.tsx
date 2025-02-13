import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Database } from '@/types/supabase';

type Collection = Database['public']['Tables']['collections']['Row'] & {
  artwork_count: number;
  likes_count: number;
  user: {
    username: string;
    avatar_url: string | null;
  };
};

interface TrendingCollectionsProps {
  collections: Collection[];
  loading?: boolean;
}

export const TrendingCollections = ({
  collections,
  loading,
}: TrendingCollectionsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="aspect-[4/3] rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {collections.map((collection) => (
        <motion.div
          key={collection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="group relative"
        >
          <Link to={`/koleksiyon/${collection.id}`}>
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={collection.cover_image || '/placeholder.png'}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-semibold truncate">{collection.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{collection.likes_count}</span>
                </div>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};
