import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: 'Hata',
        description: 'Lütfen bir arama terimi girin',
        variant: 'destructive',
      });
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ara</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              id="search"
              placeholder="Sanat eseri, sanatçı veya koleksiyon ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="col-span-3"
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
              <span className="sr-only">Ara</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
