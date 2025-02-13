import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const sortOptions = [
  { value: 'trending', label: 'Trend' },
  { value: 'latest', label: 'En Yeni' },
  { value: 'oldest', label: 'En Eski' },
  { value: 'popular', label: 'En Popüler' },
  { value: 'most_liked', label: 'En Çok Beğenilen' },
] as const;

const dateRangeOptions = [
  { value: 'all', label: 'Tüm Zamanlar' },
  { value: 'today', label: 'Bugün' },
  { value: 'week', label: 'Bu Hafta' },
  { value: 'month', label: 'Bu Ay' },
  { value: 'year', label: 'Bu Yıl' },
] as const;

const styleOptions = [
  { value: 'all', label: 'Tüm Stiller' },
  { value: '3d', label: '3D' },
  { value: 'realistic', label: 'Gerçekçi' },
  { value: 'anime', label: 'Anime' },
  { value: 'cartoon', label: 'Çizgi Film' },
  { value: 'abstract', label: 'Soyut' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'other', label: 'Diğer' },
] as const;

const formSchema = z.object({
  sort: z.enum(['trending', 'latest', 'oldest', 'popular', 'most_liked'] as const, {
    required_error: 'Sıralama seçiniz',
  }),
  dateRange: z.enum(['all', 'today', 'week', 'month', 'year'] as const, {
    required_error: 'Zaman aralığı seçiniz',
  }),
  style: z.enum(['all', '3d', 'realistic', 'anime', 'cartoon', 'abstract', 'minimalist', 'other'] as const, {
    required_error: 'Stil seçiniz',
  }),
  aiGenerated: z.boolean().optional(),
});

type FilterValues = z.infer<typeof formSchema>;

interface FilterBarProps {
  filters: FilterValues;
  onFilterChange: (values: FilterValues) => void;
}

export const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<FilterValues>({
    resolver: zodResolver(formSchema),
    defaultValues: filters,
  });

  const onSubmit = async (values: FilterValues) => {
    try {
      setLoading(true);
      onFilterChange(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sıralama</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sıralama seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zaman Aralığı</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Zaman aralığı seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dateRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stil</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Stil seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {styleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner className="mr-2" />
                Filtreleniyor...
              </>
            ) : (
              'Filtrele'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
