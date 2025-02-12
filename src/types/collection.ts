import { Artwork, CustomUser } from './artwork';

export interface Collection {
  id: string;
  name: string; // Eğer name özelliği yoksa, buraya ekleyin
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  artwork_count: number;
  likes_count: number;
  user?: CustomUser;
  artworks?: Artwork[];
}

export interface CollectionWithUser extends Collection {
  user: CustomUser;
  artwork_count: number;
  created_at: string;
  description: string;
}

export interface CreateCollectionInput {
  name: string;
  description?: string;
  is_public?: boolean;
}

export interface UpdateCollectionInput {
  name?: string;
  description?: string;
  is_public?: boolean;
}
