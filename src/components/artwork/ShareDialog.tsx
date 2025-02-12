import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { Share2, Facebook, Twitter, Link } from 'lucide-react';

interface ShareDialogProps {
  artworkId: string;
  artworkTitle: string;
  artworkUrl: string;
  trigger?: React.ReactNode;
}

export function ShareDialog({ artworkId, artworkTitle, artworkUrl, trigger }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const shareUrl = artworkUrl || `${window.location.origin}/artwork/${artworkId}`;
  const shareText = `Check out "${artworkTitle}" on Sanat Galerisi`;

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Başarılı',
        description: 'Link kopyalandı',
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: 'Hata',
        description: 'Link kopyalanırken bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paylaş</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={shareUrl}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={shareToFacebook}
              className="flex-1"
            >
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={shareToTwitter}
              className="flex-1"
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
