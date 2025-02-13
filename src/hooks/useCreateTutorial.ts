import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface Tutorial {
  title: string;
  content: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export function useCreateTutorial() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const createTutorial = async (tutorial: Tutorial) => {
    if (!user) {
      toast({
        title: 'Unauthorized',
        description: 'You must be logged in to create a tutorial.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('tutorials')
        .insert([
          {
            ...tutorial,
            user_id: user.id,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Tutorial created successfully!',
      });

      navigate(`/tutorials/${data.id}`);
    } catch (error) {
      console.error('Error creating tutorial:', error);
      toast({
        title: 'Error',
        description: 'Failed to create tutorial. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    createTutorial,
    loading,
  };
}