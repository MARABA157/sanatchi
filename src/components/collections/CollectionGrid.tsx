import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '@/types/artwork';
import { CollectionCard } from './CollectionCard';

interface CollectionGridProps {
  collections: Collection[];
  onCollectionClick?: (collection: Collection) => void;
  className?: string;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({
  collections,
  onCollectionClick,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onClick={() => onCollectionClick?.(collection)}
        />
      ))}
    </div>
  );
};

export default CollectionGrid;
