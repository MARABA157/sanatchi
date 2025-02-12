import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';

const GalleryContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  background: ${theme.colors.primary.black};
  padding: ${theme.spacing.xl} 0;
`;

const GalleryTrack = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.xl};
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const ArtworkCard = styled(motion.div)`
  flex: 0 0 300px;
  position: relative;
  border-radius: ${theme.layout.radius.lg};
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    .artwork-info {
      opacity: 1;
    }
  }
`;

const ArtworkImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ArtworkInfo = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.spacing.lg};
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0)
  );
  color: ${theme.colors.primary.white};
  opacity: 0;
  transition: opacity ${theme.transitions.medium};
`;

const ArtworkTitle = styled.h3`
  font-size: ${theme.typography.body.sizes.regular};
  font-weight: ${theme.typography.body.weights.bold};
  margin-bottom: ${theme.spacing.xs};
`;

const ArtworkArtist = styled.p`
  font-size: ${theme.typography.body.sizes.small};
  opacity: 0.8;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
  padding: 0 ${theme.spacing.xl};
`;

const FilterButton = styled(motion.button)<{ isActive: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.layout.radius.full};
  background: ${props => props.isActive ? theme.colors.primary.gold : theme.colors.accent.softGray};
  color: ${props => props.isActive ? theme.colors.primary.white : theme.colors.accent.darkGray};
  font-weight: ${theme.typography.body.weights.medium};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${props => props.isActive ? theme.colors.primary.gold : theme.colors.accent.pastelBlue};
    transform: ${theme.effects.hover.scale};
  }
`;

const LoadMoreButton = styled(motion.button)`
  display: block;
  margin: ${theme.spacing.xl} auto 0;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background: ${theme.colors.primary.gold};
  color: ${theme.colors.primary.white};
  border-radius: ${theme.layout.radius.full};
  font-weight: ${theme.typography.body.weights.bold};
`;

interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  category: string;
}

const artworks = [
  {
    id: 1,
    title: "Yağlı Boya Portre",
    artist: "Ahmet Yılmaz",
    image: "https://images.pexels.com/photos/1918290/pexels-photo-1918290.jpeg",
    category: "Portre"
  },
  {
    id: 2,
    title: "Modern Soyut",
    artist: "Zeynep Kaya",
    image: "https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg",
    category: "Soyut"
  },
  {
    id: 3,
    title: "Şehir Manzarası",
    artist: "Mehmet Demir",
    image: "https://images.pexels.com/photos/3844788/pexels-photo-3844788.jpeg",
    category: "Manzara"
  },
  {
    id: 4,
    title: "Natürmort",
    artist: "Ayşe Can",
    image: "https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg",
    category: "Natürmort"
  },
  {
    id: 5,
    title: "Deniz Manzarası",
    artist: "Can Yıldız",
    image: "https://images.pexels.com/photos/1931379/pexels-photo-1931379.jpeg",
    category: "Manzara"
  }
];

const filters = [
  { id: 'all', label: 'Tümü' },
  { id: 'painting', label: 'Resim' },
  { id: 'digital', label: 'Dijital' },
  { id: 'sculpture', label: 'Heykel' },
  { id: 'photography', label: 'Fotoğraf' },
];

export default function Gallery() {
  const [visibleArtworks, setVisibleArtworks] = useState<Artwork[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = artworks.filter(
      artwork => activeFilter === 'all' || artwork.category === activeFilter
    );
    setVisibleArtworks(filtered.slice(0, page * 12));
  }, [activeFilter, page]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const scroll = () => {
      if (!track) return;
      const scrollAmount = 1; 
      track.scrollLeft += scrollAmount;

      if (track.scrollLeft >= track.scrollWidth - track.clientWidth) {
        track.scrollLeft = 0;
      }
    };

    const interval = setInterval(scroll, 30); 

    return () => clearInterval(interval);
  }, []);

  return (
    <GalleryContainer>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Keşfet</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Sanatçıların eserlerini keşfedin ve ilham alın
          </p>
        </div>

        <FilterContainer>
          {filters.map(filter => (
            <FilterButton
              key={filter.id}
              isActive={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterContainer>

        <GalleryTrack ref={trackRef}>
          <AnimatePresence>
            {visibleArtworks.map((artwork, index) => (
              <ArtworkCard
                key={artwork.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArtworkImage src={artwork.image} alt={artwork.title} />
                <ArtworkInfo>
                  <ArtworkTitle>{artwork.title}</ArtworkTitle>
                  <ArtworkArtist>{artwork.artist}</ArtworkArtist>
                </ArtworkInfo>
              </ArtworkCard>
            ))}
          </AnimatePresence>
        </GalleryTrack>
      </div>
    </GalleryContainer>
  );
}
