import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Search, Image as ImageIcon, Palette, Calendar, Tag, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPalette {
  name: string;
  colors: string[];
}

const colorPalettes: ColorPalette[] = [
  {
    name: 'Sıcak Renkler',
    colors: ['#FF0000', '#FF4500', '#FFA500', '#FFD700']
  },
  {
    name: 'Soğuk Renkler',
    colors: ['#0000FF', '#4169E1', '#00CED1', '#40E0D0']
  },
  {
    name: 'Pastel Tonlar',
    colors: ['#FFB6C1', '#98FB98', '#87CEFA', '#DDA0DD']
  }
];

const artStyles = [
  { value: 'modern', label: 'Modern Sanat' },
  { value: 'classical', label: 'Klasik Sanat' },
  { value: 'abstract', label: 'Soyut Sanat' },
  { value: 'impressionist', label: 'Empresyonizm' },
  { value: 'surrealist', label: 'Sürrealizm' }
];

export default function AdvancedSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [useAI, setUseAI] = useState(false);
  const [searching, setSearching] = useState(false);
  const [uploadedImage, setUploadImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      // Arama mantığı burada implement edilecek
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log({
        searchTerm,
        selectedStyle,
        selectedPalette,
        priceRange,
        useAI,
        uploadedImage
      });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="p-6 bg-card rounded-lg space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Sanat eseri veya sanatçı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={handleSearch} disabled={searching}>
          {searching ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Search className="w-4 h-4" />
            </motion.div>
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stil Seçimi */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedStyle ? 
                artStyles.find(style => style.value === selectedStyle)?.label : 
                "Stil Seç"}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Stil ara..." />
              <CommandEmpty>Stil bulunamadı</CommandEmpty>
              <CommandGroup>
                {artStyles.map(style => (
                  <CommandItem
                    key={style.value}
                    value={style.value}
                    onSelect={(value) => setSelectedStyle(value)}
                  >
                    {style.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Renk Paleti */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                {selectedPalette?.name || "Renk Paleti"}
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px]">
            <div className="space-y-4">
              {colorPalettes.map((palette) => (
                <div
                  key={palette.name}
                  className={cn(
                    "p-2 rounded-lg cursor-pointer hover:bg-accent",
                    selectedPalette?.name === palette.name && "bg-accent"
                  )}
                  onClick={() => setSelectedPalette(palette)}
                >
                  <div className="text-sm font-medium mb-2">{palette.name}</div>
                  <div className="flex gap-1">
                    {palette.colors.map((color) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Fiyat Aralığı */}
        <div>
          <Label className="text-sm">Fiyat Aralığı: {priceRange[0]} - {priceRange[1]} TL</Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={10000}
            step={100}
            className="mt-2"
          />
        </div>

        {/* Görsel Arama */}
        <div className="space-y-2">
          <Label htmlFor="image-upload" className="cursor-pointer">
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
              <ImageIcon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">Görsel ile Ara</span>
            </div>
          </Label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* AI Asistan */}
      <div className="flex items-center justify-between py-4 border-t">
        <div className="space-y-1">
          <div className="font-medium">AI Asistan</div>
          <div className="text-sm text-muted-foreground">
            Daha akıllı arama sonuçları için AI kullan
          </div>
        </div>
        <Switch
          checked={useAI}
          onCheckedChange={setUseAI}
        />
      </div>
    </div>
  );
}
