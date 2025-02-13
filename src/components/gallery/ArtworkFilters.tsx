import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArtworkFilter } from '@/types/filters';
import { supabase } from '@/lib/supabase';

interface ArtworkFiltersProps {
  filters: ArtworkFilter;
  onFilterChange: (filters: Partial<ArtworkFilter>) => void;
}

export function ArtworkFilters({ filters, onFilterChange }: ArtworkFiltersProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilters() {
      try {
        setLoading(true);

        const { data: artworks } = await supabase
          .from('artworks')
          .select('category, style')
          .not('category', 'is', null)
          .not('style', 'is', null);

        if (artworks) {
          const uniqueCategories = [...new Set(artworks.map((a) => a.category))].filter(Boolean);
          const uniqueStyles = [...new Set(artworks.map((a) => a.style))].filter(Boolean);

          setCategories(uniqueCategories as string[]);
          setStyles(uniqueStyles as string[]);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilters();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange({ category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tümü</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={filters.style}
            onValueChange={(value) => onFilterChange({ style: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Stil seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tümü</SelectItem>
              {styles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={filters.sort}
            onValueChange={(value) => onFilterChange({ sort: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sıralama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Varsayılan</SelectItem>
              <SelectItem value="created_at.desc">En Yeni</SelectItem>
              <SelectItem value="created_at.asc">En Eski</SelectItem>
              <SelectItem value="likes_count.desc">En Çok Beğenilen</SelectItem>
              <SelectItem value="views_count.desc">En Çok Görüntülenen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min. Fiyat"
            value={filters.minPrice || ''}
            onChange={(e) =>
              onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
          />
          <Input
            type="number"
            placeholder="Max. Fiyat"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filters.isForSale ? 'default' : 'outline'}
            onClick={() => onFilterChange({ isForSale: !filters.isForSale })}
          >
            Satılık
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              onFilterChange({
                category: undefined,
                style: undefined,
                sort: undefined,
                minPrice: undefined,
                maxPrice: undefined,
                isForSale: undefined,
              })
            }
          >
            Filtreleri Temizle
          </Button>
        </div>
      </div>
    </div>
  );
}
