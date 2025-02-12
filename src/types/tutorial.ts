import { Database } from './supabase';

export enum TutorialLevel {
  BEGINNER = 'Başlangıç',
  INTERMEDIATE = 'Orta Seviye',
  ADVANCED = 'İleri Seviye'
}

export interface Tutorial {
  id: string;
  title: string;
  content: string;
  level: TutorialLevel;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  duration: number; // dakika cinsinden
  createdAt: Date;
  likes: number;
  views: number;
}

export type TutorialType = Database['public']['Tables']['tutorials']['Row'] & {
  user: Database['public']['Tables']['profiles']['Row'] | null;
};

export type TutorialInsert = Database['public']['Tables']['tutorials']['Insert'];
export type TutorialUpdate = Database['public']['Tables']['tutorials']['Update'];