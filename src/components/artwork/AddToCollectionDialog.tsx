import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { Artwork, Collection } from '@/types/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AddToCollectionDialogProps {
  artwork: Artwork;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AddToCollectionDialog({
  artwork,
  trigger,
  onSuccess,
}: AddToCollectionDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchCollections = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setCollections(data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast({
        title: 'Hata',
        description: 'Koleksiyonlar yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCollection = async (collectionId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('collection_artworks').insert({
        collection_id: collectionId,
        artwork_id: artwork.id,
      });

      if (error) throw error;

      toast({
        title: 'Başarılı',
        description: 'Eser koleksiyona eklendi',
      });
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast({
        title: 'Hata',
        description: 'Eser koleksiyona eklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (open: boolean) => {
    setOpen(open);
    if (open) {
      await fetchCollections();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Koleksiyona Ekle
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Koleksiyona Ekle</DialogTitle>
          <DialogDescription>
            Eseri eklemek istediğiniz koleksiyonu seçin veya yeni bir koleksiyon oluşturun.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-4">
            <LoadingSpinner />
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Henüz bir koleksiyonunuz yok.
            </p>
            <Button onClick={() => navigate('/collections/create')}>
              Koleksiyon Oluştur
            </Button>
          </div>
        ) : (
          <div className="grid gap-2">
            {collections.map((collection) => (
              <Button
                key={collection.id}
                variant="outline"
                className="justify-start"
                onClick={() => addToCollection(collection.id)}
                disabled={loading}
              >
                {collection.name}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
