import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { motion } from 'framer-motion';

const HeroContainer = styled.section`
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.gradient.dark};
`;

const HeroContent = styled.div`
  text-align: center;
  color: ${theme.colors.primary.white};
  z-index: 2;
  padding: ${theme.spacing.xl};
`;

const HeroTitle = styled(motion.h1)`
  font-size: 72px;
  margin-bottom: ${theme.spacing.lg};
  background: ${theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 48px;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: ${theme.typography.accent.size};
  margin-bottom: ${theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroButton = styled(motion.button)`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background: ${theme.colors.primary.gold};
  color: ${theme.colors.primary.white};
  border-radius: ${theme.layout.radius.full};
  font-weight: ${theme.typography.body.weights.bold};
  font-size: ${theme.typography.body.sizes.regular};
  
  &:hover {
    transform: ${theme.effects.hover.scale};
    box-shadow: ${theme.shadows.lg};
  }
`;

const BackgroundParticles = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  opacity: 0.5;
`;

const cities = [
  {
    name: "İstanbul",
    description: "Kültürlerin Buluşma Noktası",
    image: "https://images.pexels.com/photos/3551662/pexels-photo-3551662.jpeg"
  },
  {
    name: "Paris",
    description: "Sanatın Başkenti",
    image: "https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg"
  },
  {
    name: "New York",
    description: "Modern Sanatın Merkezi",
    image: "https://images.pexels.com/photos/2224861/pexels-photo-2224861.jpeg"
  }
];

export default function Hero() {
  const [currentCityIndex, setCurrentCityIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % cities.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HeroContainer>
      {cities.map((city, index) => (
        <motion.div
          key={city.name}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: index === currentCityIndex ? 1 : 0,
            scale: index === currentCityIndex ? 1.1 : 1
          }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/60" />
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/20967/pexels-photo.jpg';
            }}
          />
          <div className="absolute bottom-8 right-8 text-white/60 text-lg">
            {city.name} - {city.description}
          </div>
        </motion.div>
      ))}
      <BackgroundParticles
        animate={{
          background: [
            'radial-gradient(circle, #FFD700 1px, transparent 1px)',
            'radial-gradient(circle, #FFA500 1px, transparent 1px)',
          ],
          backgroundSize: ['50px 50px', '30px 30px'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <HeroContent>
        <HeroTitle
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Sanat ve Yapay Zeka
        </HeroTitle>

        <HeroSubtitle
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Yapay zeka ile sanatın sınırlarını keşfedin. Yeni nesil sanat galerisi deneyimi için hoş geldiniz.
        </HeroSubtitle>

        <HeroButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Keşfetmeye Başla
        </HeroButton>
      </HeroContent>
    </HeroContainer>
  );
};
