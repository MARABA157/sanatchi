export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          specialties: string[]
          website: string | null
          social_links: Json | null
          created_at: string
          updated_at: string
          featured: boolean
          total_views: number
          total_likes: number
          avatar_url: string | null
          cover_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          specialties?: string[]
          website?: string | null
          social_links?: Json | null
          created_at?: string
          updated_at?: string
          featured?: boolean
          total_views?: number
          total_likes?: number
          avatar_url?: string | null
          cover_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          bio?: string | null
          specialties?: string[]
          website?: string | null
          social_links?: Json | null
          created_at?: string
          updated_at?: string
          featured?: boolean
          total_views?: number
          total_likes?: number
          avatar_url?: string | null
          cover_url?: string | null
        }
      }
      artworks: {
        Row: {
          id: string
          artist_id: string
          title: string
          description: string | null
          image_url: string
          tags: string[]
          created_at: string
          updated_at: string
          likes_count: number
          views_count: number
          comments_count: number
          ai_generated: boolean
          ai_style: string | null
          ai_prompt: string | null
          for_sale: boolean
          price: number | null
          medium: string
          dimensions: string | null
        }
        Insert: {
          id?: string
          artist_id: string
          title: string
          description?: string | null
          image_url: string
          tags?: string[]
          created_at?: string
          updated_at?: string
          likes_count?: number
          views_count?: number
          comments_count?: number
          ai_generated?: boolean
          ai_style?: string | null
          ai_prompt?: string | null
          for_sale?: boolean
          price?: number | null
          medium?: string
          dimensions?: string | null
        }
        Update: {
          id?: string
          artist_id?: string
          title?: string
          description?: string | null
          image_url?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
          likes_count?: number
          views_count?: number
          comments_count?: number
          ai_generated?: boolean
          ai_style?: string | null
          ai_prompt?: string | null
          for_sale?: boolean
          price?: number | null
          medium?: string
          dimensions?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          artwork_id: string
          content: string
          created_at: string
          updated_at: string
          likes_count: number
          parent_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          artwork_id: string
          content: string
          created_at?: string
          updated_at?: string
          likes_count?: number
          parent_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          artwork_id?: string
          content?: string
          created_at?: string
          updated_at?: string
          likes_count?: number
          parent_id?: string | null
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          artwork_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          artwork_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          artwork_id?: string
          created_at?: string
        }
      }
      ai_styles: {
        Row: {
          id: string
          name: string
          description: string
          preview_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          preview_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          preview_url?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
