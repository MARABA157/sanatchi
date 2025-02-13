export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      artworks: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string | null;
          image_url: string;
          user_id: string;
          style: string | null;
          status: 'pending' | 'approved' | 'rejected';
          views_count: number;
          likes_count: number;
          comments_count: number;
          category: string | null;
          tags: string[] | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description?: string | null;
          image_url: string;
          user_id: string;
          style?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          views_count?: number;
          likes_count?: number;
          comments_count?: number;
          category?: string | null;
          tags?: string[] | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          user_id?: string;
          style?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          views_count?: number;
          likes_count?: number;
          comments_count?: number;
          category?: string | null;
          tags?: string[] | null;
        };
      };
      tutorials: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          title: string;
          description: string;
          video_url: string;
          image_url: string | null;
          category: 'beginner' | 'intermediate' | 'advanced';
          user_id: string;
          views_count: number;
          likes_count: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          title: string;
          description: string;
          video_url: string;
          image_url?: string | null;
          category: 'beginner' | 'intermediate' | 'advanced';
          user_id: string;
          views_count?: number;
          likes_count?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          title?: string;
          description?: string;
          video_url?: string;
          image_url?: string | null;
          category?: 'beginner' | 'intermediate' | 'advanced';
          user_id?: string;
          views_count?: number;
          likes_count?: number;
        };
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          avatar_url: string | null;
          website: string | null;
          bio: string | null;
          role: 'user' | 'admin';
          email: string;
          preferences: Json | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          full_name: string;
          avatar_url?: string | null;
          website?: string | null;
          bio?: string | null;
          role?: 'user' | 'admin';
          email: string;
          preferences?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          full_name?: string;
          avatar_url?: string | null;
          website?: string | null;
          bio?: string | null;
          role?: 'user' | 'admin';
          email?: string;
          preferences?: Json | null;
        };
      };
      comments: {
        Row: {
          id: string;
          created_at: string;
          content: string;
          user_id: string;
          artwork_id: string;
          parent_id: string | null;
          likes_count: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          content: string;
          user_id: string;
          artwork_id: string;
          parent_id?: string | null;
          likes_count?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          content?: string;
          user_id?: string;
          artwork_id?: string;
          parent_id?: string | null;
          likes_count?: number;
        };
      };
      collections: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string | null;
          user_id: string;
          is_public: boolean;
          artworks: string[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description?: string | null;
          user_id: string;
          is_public?: boolean;
          artworks?: string[];
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string | null;
          user_id?: string;
          is_public?: boolean;
          artworks?: string[];
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface Collection {
  id: string;
  name: string;
  cover_image: string;
  featured: boolean;
  artwork_count: number;
  user?: Profile;
  artworks?: Artwork[];
}

export interface Artwork {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  user_id: string;
  artist: string;
  likes: number;
  comments: number;
  views: number;
  user?: Profile;
  stats?: {
    like_count: number;
    comment_count: number;
    view_count: number;
  }
}

export type CollectionArtwork = Database['public']['Tables']['collection_artworks']['Row'];
export type ArtworkStats = Database['public']['Tables']['artwork_stats']['Row'];
