import { Categories } from './artwork';

export type SortOption =
  | 'created_at.desc'
  | 'created_at.asc'
  | 'likes.desc'
  | 'views.desc'
  | 'price.asc'
  | 'price.desc';

export interface ArtworkFilter {
  category?: string;
  style?: string;
  status?: 'pending' | 'approved' | 'rejected';
  userId?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  isForSale?: boolean;
  tags?: string[];
}

export interface CollectionFilter {
  userId?: string;
  isPublic?: boolean;
  search?: string;
  sort?: string;
}

export interface TutorialFilter {
  category?: 'beginner' | 'intermediate' | 'advanced';
  userId?: string;
  search?: string;
  sort?: string;
}

export interface SearchFilters {
  query: string;
  type: 'artwork' | 'collection' | 'tutorial' | 'user';
  sort: 'relevance' | 'newest' | 'oldest';
}

export interface PaginationOptions {
  page: number & { _brand: 'PositiveInteger' };
  limit: number & { _brand: 'PositiveInteger' };
}

// Validation helper
export function createPaginationOptions(page: number, limit: number): PaginationOptions {
  if (page < 1) throw new Error('Page must be greater than 0');
  if (limit < 1) throw new Error('Limit must be greater than 0');
  return { page, limit } as PaginationOptions;
}
