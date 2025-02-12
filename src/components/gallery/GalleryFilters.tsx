import React from 'react';
import { Categories } from '@/types/artwork';

interface GalleryFiltersProps {
  onCategoryChange: (category: Categories | null) => void;
}

export const GalleryFilters: React.FC<GalleryFiltersProps> = ({ onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onCategoryChange(null)}
        className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
      >
        Tümü
      </button>
      {Object.values(Categories).map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default GalleryFilters;