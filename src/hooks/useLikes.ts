import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { measureAsyncOperation } from '@/lib/performance';
import { trackEvent } from '@/lib/analytics';

interface Like {
  id: string;
  user_id: string;
  artwork_id: string;
  created_at: string;
}

export function useLikes(artworkId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: isLiked } = useQuery({
    queryKey: ['likes', artworkId, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const result = await measureAsyncOperation('check_like', async () => {
        const { data, error } = await supabase
          .from('artwork_likes')
          .select('id')
          .eq('artwork_id', artworkId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        return !!data;
      });

      return result;
    },
    enabled: !!user,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      await measureAsyncOperation('toggle_like', async () => {
        if (isLiked) {
          const { error } = await supabase
            .from('artwork_likes')
            .delete()
            .eq('artwork_id', artworkId)
            .eq('user_id', user.id);

          if (error) throw error;
        } else {
          const { error } = await supabase.from('artwork_likes').insert([
            {
              artwork_id: artworkId,
              user_id: user.id,
            },
          ]);

          if (error) throw error;
        }
      });

      trackEvent('toggle_like', {
        artwork_id: artworkId,
        action: isLiked ? 'unlike' : 'like',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes'] });
      queryClient.invalidateQueries({
        queryKey: ['artwork', artworkId],
      });
    },
  });

  return {
    isLiked: !!isLiked,
    toggleLike: likeMutation.mutate,
    isLoading: likeMutation.isPending,
  };
}