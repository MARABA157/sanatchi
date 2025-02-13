import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { UserPreferences } from '@/types/preferences';

interface PreferencesFormProps {
  initialValues?: UserPreferences;
}

export function PreferencesForm({ initialValues }: PreferencesFormProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    language: 'tr',
    aiStyle: {
      artStyle: 'realistic',
      colorPalette: 'vibrant',
      complexity: 'moderate'
    },
    notifications: {
      email: true,
      browser: true
    },
    displayMode: 'grid',
    autoplay: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setPreferences(initialValues);
      setTheme(initialValues.theme);
    } else if (user) {
      void loadPreferences();
    }
  }, [user, initialValues]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;

      if (data) {
        setPreferences(data as UserPreferences);
        setTheme(data.theme);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: 'Hata',
        description: 'Tercihler yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user!.id,
          ...preferences,
        });

      if (error) throw error;

      toast({
        title: 'Başarılı',
        description: 'Tercihleriniz kaydedildi.',
      });

      setTheme(preferences.theme);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Hata',
        description: 'Tercihler kaydedilirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Tema</Label>
          <RadioGroup
            value={preferences.theme}
            onValueChange={(value) =>
              setPreferences({ ...preferences, theme: value as UserPreferences['theme'] })
            }
            className="grid grid-cols-3 gap-4 mt-2"
          >
            <div>
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Açık</Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Koyu</Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">Sistem</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Dil</Label>
          <RadioGroup
            value={preferences.language}
            onValueChange={(value) =>
              setPreferences({ ...preferences, language: value as UserPreferences['language'] })
            }
            className="grid grid-cols-2 gap-4 mt-2"
          >
            <div>
              <RadioGroupItem value="tr" id="tr" />
              <Label htmlFor="tr">Türkçe</Label>
            </div>
            <div>
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en">English</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Kaydediliyor...' : 'Kaydet'}
      </Button>
    </form>
  );
}