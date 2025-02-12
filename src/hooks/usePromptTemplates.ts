import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface PromptTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function usePromptTemplates() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user]);

  const loadTemplates = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading prompt templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load prompt templates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (template: Omit<PromptTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create templates',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('prompt_templates')
        .insert([
          {
            ...template,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTemplates([data, ...templates]);
      
      toast({
        title: 'Success',
        description: 'Template created successfully',
      });
    } catch (error) {
      console.error('Error creating prompt template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create template',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (id: string, updates: Partial<Omit<PromptTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update templates',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('prompt_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTemplates(templates.map((t) => (t.id === id ? data : t)));
      
      toast({
        title: 'Success',
        description: 'Template updated successfully',
      });
    } catch (error) {
      console.error('Error updating prompt template:', error);
      toast({
        title: 'Error',
        description: 'Failed to update template',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to delete templates',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('prompt_templates')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTemplates(templates.filter((t) => t.id !== id));
      
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting prompt template:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}