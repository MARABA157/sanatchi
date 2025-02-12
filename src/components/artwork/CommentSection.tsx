import { useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Avatar } from '@/components/ui/avatar';
import type { Comment, Profile } from '@/types/supabase';

interface CommentWithUser extends Comment {
  user: Profile;
}

interface CommentSectionProps {
  artworkId: string;
}

export function CommentSection({ artworkId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false); // Yeni loading durumu
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [artworkId]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, user:profiles(*)')
        .eq('artwork_id', artworkId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComments(data as CommentWithUser[]);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Hata',
        description: 'Yorumlar yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Hata',
        description: 'Yorum yapmak için giriş yapmalısınız',
        variant: 'destructive',
      });
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('comments').insert({
        content: newComment.trim(),
        artwork_id: artworkId,
        user_id: user.id,
      });

      if (error) throw error;

      setNewComment('');
      await fetchComments();  // Yorum ekledikten sonra yorumları tekrar yükle
      toast({
        title: 'Başarılı',
        description: 'Yorumunuz eklendi',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Hata',
        description: 'Yorum eklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Yorumlar</h2>

      {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={loading || !newComment.trim()}>
            {loading ? 'Gönderiliyor...' : 'Yorum Yap'}
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {loadingComments ? (
          <div>Yorumlar yükleniyor...</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar
                src={comment.user.avatar_url || undefined}
                alt={comment.user.username}
                fallback={comment.user.username.slice(0, 2).toUpperCase()}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{comment.user.username}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistance(new Date(comment.created_at), new Date(), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </span>
                </div>
                <p className="mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
