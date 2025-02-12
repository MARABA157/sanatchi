import React from 'react';
import { getPlaiceholder } from 'plaiceholder';
import type { GetPlaiceholderReturn } from 'plaiceholder';

export interface OptimizedImage {
  base64: string;
  img: {
    src: string;
    width: number;
    height: number;
    type: string;
  };
}

export async function getOptimizedImage(imageUrl: string): Promise<OptimizedImage> {
  try {
    const buffer = await fetch(imageUrl).then(async (res) =>
      Buffer.from(await res.arrayBuffer())
    );

    const {
      metadata: { width, height },
      base64,
    } = await getPlaiceholder(buffer);

    return {
      base64,
      img: {
        src: imageUrl,
        width,
        height,
        type: 'image/jpeg', // Varsayılan olarak JPEG kullanıyoruz
      },
    };
  } catch (error) {
    console.error('Error optimizing image:', error);
    return {
      base64: '',
      img: {
        src: imageUrl,
        width: 0,
        height: 0,
        type: 'image/jpeg',
      },
    };
  }
}

export function generateSrcSet(src: string, sizes: number[]): string {
  const cloudinaryUrl = new URL(src);
  const params = new URLSearchParams(cloudinaryUrl.search);

  return sizes
    .map(size => {
      params.set('w', size.toString());
      cloudinaryUrl.search = params.toString();
      return `${cloudinaryUrl.toString()} ${size}w`;
    })
    .join(', ');
}

export function generateImageSizes(
  defaultSize: number,
  breakpoints: { [key: string]: number }
): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(min-width: ${breakpoint}px) ${size}px`)
    .concat([`${defaultSize}px`])
    .join(', ');
}

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}) => {
  const sizes = generateImageSizes(width || 300, {
    640: 640,
    768: 768,
    1024: 1024,
    1280: 1280,
  });

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      sizes={sizes}
      srcSet={generateSrcSet(src, [300, 600, 900, 1200])}
    />
  );
};
