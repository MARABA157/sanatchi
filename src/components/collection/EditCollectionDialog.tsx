import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Collection } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import { ImageUpload } from '@/components/shared/ImageUpload';

const formSchema = z.object({
  name: z.string().min(3, 'En az 3 karakter olmalı'),
  description: z.string().optional(),
  cover_image: z.string().optional(),
  featured: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCollectionDialogProps {
  collection: Collection;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (collection: Collection) => void;
}

export function EditCollectionDialog({
  collection,
  open,
  onOpenChange,
  onUpdate,
}: EditCollectionDialogProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: collection.name,
      description: collection.description || '',
      cover_image: collection.cover_image || '',
      featured: collection.featured || false,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: collection.name,
        description: collection.description || '',
        cover_image: collection.cover_image || '',
        featured: collection.featured || false,
      });
    }
  }, [open, collection, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .update({
          name: values.name,
          description: values.description,
          cover_image: values.cover_image,
          featured: values.featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', collection.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Başarılı',
        description: 'Koleksiyon başarıyla güncellendi',
      });

      onUpdate?.(data as Collection);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating collection:', error);
      toast({
        title: 'Hata',
        description: 'Koleksiyon güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Koleksiyon Düzenle</DialogTitle>
          <DialogDescription>
            Koleksiyon bilgilerini güncelleyebilirsiniz.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Koleksiyon Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Koleksiyon adı" {...field} />
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
                      placeholder="Koleksiyon açıklaması"
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
              name="cover_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kapak Görseli</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => field.onChange('')}
                      maxSize={5}
                      aspectRatio={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="submit">Kaydet</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
