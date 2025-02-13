import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Collection } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditCollectionDialog } from './EditCollectionDialog';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';

interface CollectionCardProps {
  collection: Collection;
  onDelete?: (id: string) => void;
  onUpdate?: (collection: Collection) => void;
  showActions?: boolean;
  className?: string;
}

export function CollectionCard({
  collection,
  onDelete,
  onUpdate,
  showActions = true,
  className = '',
}: CollectionCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const isOwner = useMemo(() => user?.id === collection.user_id, [user, collection.user_id]);

  const handleDelete = async () => {
    if (!window.confirm('Koleksiyonu silmek istediğinize emin misiniz?')) return;

    try {
      const { error } = await supabase.from('collections').delete().eq('id', collection.id);

      if (error) throw error;

      toast({
        title: 'Başarılı',
        description: 'Koleksiyon başarıyla silindi',
      });

      onDelete?.(collection.id);
    } catch (error) {
      console.error('Koleksiyon silinirken hata oluştu:', error);
      toast({
        title: 'Hata',
        description: 'Koleksiyon silinirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`group relative overflow-hidden rounded-lg ${className}`}>
      <Link to={`/collections/${collection.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={collection.cover_image || '/placeholder-collection.jpg'}
            alt={`${collection.name} koleksiyonu`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 p-4 text-white">
          <h3 className="text-lg font-semibold line-clamp-1">{collection.name}</h3>
          {collection.description && (
            <p className="mt-1 text-sm text-gray-200 line-clamp-2">{collection.description}</p>
          )}
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span>{collection.artwork_count || 0} eser</span>
            {collection.featured && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs">Öne Çıkan</span>
            )}
          </div>
        </div>
      </Link>

      {showActions && isOwner && (
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/20 hover:bg-black/40"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Düzenle</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>Sil</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <EditCollectionDialog
            collection={collection}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </div>
  );
}
