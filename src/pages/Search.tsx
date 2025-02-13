import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Search as SearchIcon,
  Grid,
  ListFilter,
  SlidersHorizontal,
  X,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type Artwork = Database['public']['Tables']['artworks']['Row'];

const COLORS = [
  { name: 'Kırmızı', value: 'red' },
  { name: 'Mavi', value: 'blue' },
  { name: 'Yeşil', value: 'green' },
  { name: 'Sarı', value: 'yellow' },
  { name: 'Mor', value: 'purple' },
  { name: 'Turuncu', value: 'orange' },
  { name: 'Siyah', value: 'black' },
  { name: 'Beyaz', value: 'white' },
];

const STYLES = [
  'Yağlı Boya',
  'Suluboya',
  'Dijital',
  'Fotoğraf',
  'Heykel',
  'Çizim',
  'AI',
  'Karışık Teknik',
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtreler
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [dateRange, setDateRange] = useState([2020, 2024]);

  useEffect(() => {
    fetchArtworks();
  }, [searchParams]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      let query = supabase.from('artworks').select('*');

      // Filtreleri uygula
      if (searchParams.get('q')) {
        query = query.textSearch('title', searchParams.get('q')!);
      }

      if (selectedColors.length > 0) {
        query = query.contains('tags', selectedColors);
      }

      if (selectedStyles.length > 0) {
        query = query.in('medium', selectedStyles);
      }

      const { data, error } = await query;

      if (error) throw error;
      setArtworks(data || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedColors.length) params.set('colors', selectedColors.join(','));
    if (selectedStyles.length) params.set('styles', selectedStyles.join(','));
    params.set('price_min', priceRange[0].toString());
    params.set('price_max', priceRange[1].toString());
    params.set('year_min', dateRange[0].toString());
    params.set('year_max', dateRange[1].toString());
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-black/95 py-12">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sanat eseri veya sanatçı ara..."
              className="pl-10 bg-white/5 border-white/10 text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filtreler
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')}>
              <Grid className={`w-5 h-5 ${viewMode === 'grid' ? 'text-primary' : 'text-white/60'}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setViewMode('list')}>
              <ListFilter className={`w-5 h-5 ${viewMode === 'list' ? 'text-primary' : 'text-white/60'}`} />
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 rounded-xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Colors */}
              <div>
                <h3 className="text-white font-medium mb-3">Renkler</h3>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setSelectedColors(
                          selectedColors.includes(color.value)
                            ? selectedColors.filter((c) => c !== color.value)
                            : [...selectedColors, color.value]
                        );
                      }}
                      className={`
                        px-3 py-1 rounded-full text-sm
                        ${selectedColors.includes(color.value)
                          ? 'bg-primary text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }
                      `}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Styles */}
              <div>
                <h3 className="text-white font-medium mb-3">Stiller</h3>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => {
                        setSelectedStyles(
                          selectedStyles.includes(style)
                            ? selectedStyles.filter((s) => s !== style)
                            : [...selectedStyles, style]
                        );
                      }}
                      className={`
                        px-3 py-1 rounded-full text-sm
                        ${selectedStyles.includes(style)
                          ? 'bg-primary text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }
                      `}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-white font-medium mb-3">Fiyat Aralığı</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={10000}
                  step={100}
                  className="mb-2"
                />
                <div className="flex justify-between text-white/60 text-sm">
                  <span>{priceRange[0]}₺</span>
                  <span>{priceRange[1]}₺</span>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h3 className="text-white font-medium mb-3">Tarih Aralığı</h3>
                <Slider
                  value={dateRange}
                  onValueChange={setDateRange}
                  min={2020}
                  max={2024}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-white/60 text-sm">
                  <span>{dateRange[0]}</span>
                  <span>{dateRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-4">
              <Button variant="ghost" onClick={() => {
                setSelectedColors([]);
                setSelectedStyles([]);
                setPriceRange([0, 10000]);
                setDateRange([2020, 2024]);
              }}>
                <X className="w-4 h-4 mr-2" />
                Temizle
              </Button>
              <Button onClick={handleSearch}>
                <SearchIcon className="w-4 h-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center text-white/60 py-12">Yükleniyor...</div>
        ) : artworks.length === 0 ? (
          <div className="text-center text-white/60 py-12">Sonuç bulunamadı</div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {artworks.map((artwork) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={viewMode === 'grid' ? 'group relative' : 'flex gap-6 items-center bg-white/5 rounded-xl p-4'}
              >
                <div className={viewMode === 'grid' ? 'aspect-square rounded-xl overflow-hidden bg-white/5' : 'w-40 h-40 rounded-xl overflow-hidden'}>
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                
                <div className={viewMode === 'grid' ? 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl' : 'flex-1'}>
                  <div className={viewMode === 'grid' ? 'absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300' : ''}>
                    <h3 className="text-white font-bold text-xl mb-2">{artwork.title}</h3>
                    {artwork.description && (
                      <p className="text-white/80 text-sm mb-4">{artwork.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="text-white/90 hover:text-white transition-colors flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          <span>{artwork.likes_count}</span>
                        </button>
                        <button className="text-white/90 hover:text-white transition-colors flex items-center gap-2">
                          <MessageCircle className="w-5 h-5" />
                          <span>{artwork.comments_count}</span>
                        </button>
                      </div>
                      <button className="text-white/90 hover:text-white transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
