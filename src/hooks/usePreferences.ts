import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface Preferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
  };
}

const defaultPreferences: Preferences = {
  theme: 'system',
  language: 'tr',
  notifications: {
    email: true,
    push: true,
    marketing: false,
  },
  accessibility: {
    reduceMotion: false,
    highContrast: false,
  },
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      setPreferences(defaultPreferences);
      setLoading(false);
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load preferences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<Preferences>) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update preferences',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const updatedPreferences = {
        ...preferences,
        ...newPreferences,
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferences: updatedPreferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setPreferences(updatedPreferences);
      
      toast({
        title: 'Success',
        description: 'Preferences updated successfully',
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update preferences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
  };
}