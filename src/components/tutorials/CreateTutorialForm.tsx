import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { TutorialType } from '@/types/tutorial';

const formSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir'),
  description: z.string().min(1, 'Açıklama gereklidir'),
  video_url: z.string().url('Geçerli bir URL giriniz'),
  image_url: z.string().url('Geçerli bir URL giriniz').optional(),
  category: z.enum(['beginner', 'intermediate', 'advanced']),
});

interface CreateTutorialFormProps {
  tutorial?: TutorialType;
  onSuccess: () => void;
}

export function CreateTutorialForm({ tutorial, onSuccess }: CreateTutorialFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: tutorial?.title || '',
      description: tutorial?.description || '',
      video_url: tutorial?.video_url || '',
      image_url: tutorial?.image_url || '',
      category: tutorial?.category || 'beginner',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    try {
      setIsSubmitting(true);

      if (tutorial) {
        const { error } = await supabase
          .from('tutorials')
          .update({
            ...values,
            updated_at: new Date().toISOString(),
          })
          .eq('id', tutorial.id);

        if (error) throw error;

        toast({
          title: 'Başarılı',
          description: 'Eğitim başarıyla güncellendi',
        });
      } else {
        const { error } = await supabase.from('tutorials').insert({
          ...values,
          user_id: user.id,
        });

        if (error) throw error;

        toast({
          title: 'Başarılı',
          description: 'Eğitim başarıyla oluşturuldu',
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error submitting tutorial:', error);
      toast({
        title: 'Hata',
        description: 'Eğitim kaydedilirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Başlık</FormLabel>
              <FormControl>
                <Input placeholder="Eğitim başlığı" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Eğitim açıklaması"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="video_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapak Resmi URL (Opsiyonel)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seviye</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seviye seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Başlangıç</SelectItem>
                  <SelectItem value="intermediate">Orta Seviye</SelectItem>
                  <SelectItem value="advanced">İleri Seviye</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? 'Kaydediliyor...'
            : tutorial
            ? 'Güncelle'
            : 'Oluştur'}
        </Button>
      </form>
    </Form>
  );
}