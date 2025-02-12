import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ArtworkCardProps {
  artwork: {
    id: string;
    title: string;
    artist: string;
    image_url: string;
  };
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold">{artwork.title}</h3>
        <p className="text-sm text-muted-foreground">{artwork.artist}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/artwork/${artwork.id}`)}
          className="w-full"
        >
          Detaylar
        </Button>
      </CardFooter>
    </Card>
  );
}
