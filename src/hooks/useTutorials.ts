import { useState, useEffect } from 'react';
import { Tutorial, TutorialLevel } from '../types/tutorial';
import { supabase } from '../lib/supabase';

export function useTutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<TutorialLevel | null>(null);

  useEffect(() => {
    loadTutorials();
  }, [level]);

  const loadTutorials = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('tutorials')
        .select(`
          *,
          author:author_id(
            id,
            username,
            avatar_url
          )
        `);
      
      if (level) {
        query = query.eq('level', level);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setTutorials(data.map((tutorial: any) => ({
        ...tutorial,
        author: {
          id: tutorial.author.id,
          name: tutorial.author.username,
          avatar: tutorial.author.avatar_url
        },
        createdAt: new Date(tutorial.created_at)
      })));
    } catch (error) {
      console.error('Error loading tutorials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByLevel = (newLevel: TutorialLevel | null) => {
    setLevel(newLevel);
  };

  return {
    tutorials,
    loading,
    filterByLevel
  };
}