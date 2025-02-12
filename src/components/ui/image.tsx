import { useState, useEffect, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  loadingClassName?: string;
}

export function Image({ src, alt, className, loadingClassName, ...props }: ImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');

  useEffect(() => {
    const img = new window.Image();
    img.src = src;

    img.onload = () => {
      setImgSrc(src);
      setLoading(false);
    };

    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
  }, [src]);

  if (error) {
    return (
      <div className={cn(
        'bg-muted flex items-center justify-center',
        className
      )}>
        <span className="text-muted-foreground">Resim yüklenemedi</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn(
        loading ? loadingClassName : className,
        'transition-opacity duration-300',
        loading ? 'opacity-50' : 'opacity-100'
      )}
      {...props}
    />
  );
}
