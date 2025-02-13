import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { TutorialType } from '@/types/tutorial';
import { supabase } from '@/lib/supabase';
import { CreateTutorialForm } from './CreateTutorialForm';

interface TutorialCardProps {
  tutorial: TutorialType;
  onUpdate: () => void;
}

export function TutorialCard({ tutorial, onUpdate }: TutorialCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const isOwner = user?.id === tutorial.user_id;

  const handleDelete = async () => {
    if (!confirm('Bu eğitimi silmek istediğinizden emin misiniz?')) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('tutorials')
        .delete()
        .eq('id', tutorial.id);

      if (error) throw error;

      toast({
        title: 'Başarılı',
        description: 'Eğitim başarıyla silindi',
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      toast({
        title: 'Hata',
        description: 'Eğitim silinirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'beginner':
        return 'Başlangıç';
      case 'intermediate':
        return 'Orta Seviye';
      case 'advanced':
        return 'İleri Seviye';
      default:
        return category;
    }
  };

  return (
    <Card className="overflow-hidden">
      {tutorial.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={tutorial.image_url}
            alt={tutorial.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{tutorial.title}</CardTitle>
            <CardDescription>{tutorial.description}</CardDescription>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Düzenle
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Sil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{tutorial.user?.full_name || 'Anonim'}</span>
          <span>•</span>
          <span>{getCategoryLabel(tutorial.category)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <a href={tutorial.video_url} target="_blank" rel="noopener noreferrer">
            Eğitime Git
          </a>
        </Button>
      </CardFooter>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <CreateTutorialForm
            tutorial={tutorial}
            onSuccess={() => {
              onUpdate();
              setShowEditDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}