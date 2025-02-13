import { User as SupabaseUser } from '@supabase/supabase-js';

export enum Categories {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
  ABSTRACT = 'abstract',
  DIGITAL = 'digital',
  FANTASY = 'fantasy',
  MODERN = 'modern',
}

export type ArtworkType = 'digital' | 'traditional' | 'photography' | 'mixed-media' | 'other';

export interface CustomUser {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  artwork_count: number;
  user?: CustomUser;
}

export interface Artwork {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  user_id: string;
  category: Categories;
  type: ArtworkType;
  created_at: string;
  updated_at: string;
  price?: number;
  is_for_sale?: boolean;
  tags?: string[];
  user: CustomUser;
  stats?: {
    likes: number;
    comments: number;
    views: number;
  };
}

export interface ArtworkComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  artwork_id: string;
  user: CustomUser;
}

export interface ArtworkStats {
  like_count: number;
  comment_count: number;
  view_count: number;
  is_liked?: boolean;
  is_saved?: boolean;
  is_featured?: boolean;
}

export interface Like {
  id: string;
  user_id: string;
  artwork_id: string;
  created_at: string;
}

export interface Save {
  id: string;
  user_id: string;
  artwork_id: string;
  collection_id: string;
  created_at: string;
}

export interface ArtworkFilter {
  search?: string;
  category?: Categories;
  type?: ArtworkType;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'price' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  tags?: string[];
  userId?: string;
  isForSale?: boolean;
}