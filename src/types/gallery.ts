import { Artwork } from './artwork';

export interface GalleryFilters {
  category?: string;
  style?: string;
  price?: {
    min: number;
    max: number;
  };
  sortBy?: 'newest' | 'popular' | 'price_asc' | 'price_desc';
}

export interface GalleryState {
  artworks: Artwork[];
  filters: GalleryFilters;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

export interface GalleryActions {
  setArtworks: (artworks: Artwork[]) => void;
  setFilters: (filters: GalleryFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  setPage: (page: number) => void;
}
