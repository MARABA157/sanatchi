import { useState, useEffect } from 'react';
import { Tutorial } from '../types/tutorial';
import { supabase } from '../lib/supabase';

export function useTutorialDetail(tutorialId: string) {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadTutorial();
  }, [tutorialId]);

  const loadTutorial = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tutorials')
        .select(`
          *,
          author:author_id(
            id,
            username,
            avatar_url
          )
        `)
        .eq('id', tutorialId)
        .single();

      if (error) throw error;

      if (data) {
        setTutorial({
          ...data,
          author: {
            id: data.author.id,
            name: data.author.username,
            avatar: data.author.avatar_url
          },
          createdAt: new Date(data.created_at)
        });
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    tutorial,
    loading,
    error
  };
}