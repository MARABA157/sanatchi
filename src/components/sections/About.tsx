import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

const AboutContainer = styled.section`
  min-height: 100vh;
  background: ${theme.colors.primary.white};
  padding: ${theme.spacing.xxl} 0;
`;

const AboutContent = styled.div`
  max-width: ${theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing.xl};
`;

const AboutHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xxl};
`;

const AboutTitle = styled(motion.h2)`
  color: ${theme.colors.accent.darkGray};
  font-size: ${theme.typography.heading.sizes.h2};
  margin-bottom: ${theme.spacing.lg};
`;

const AboutDescription = styled(motion.p)`
  color: ${theme.colors.accent.darkGray};
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.8;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xxl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background: ${theme.colors.primary.white};
  border-radius: ${theme.layout.radius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  transition: all ${theme.transitions.medium};

  &:hover {
    transform: ${theme.effects.hover.scale};
    box-shadow: ${theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${theme.colors.gradient.primary};
  border-radius: ${theme.layout.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.primary.white};
  font-size: 24px;
`;

const FeatureTitle = styled.h3`
  color: ${theme.colors.accent.darkGray};
  font-size: ${theme.typography.body.sizes.large};
  font-weight: ${theme.typography.body.weights.bold};
  margin-bottom: ${theme.spacing.md};
`;

const FeatureDescription = styled.p`
  color: ${theme.colors.accent.darkGray};
  opacity: 0.8;
  line-height: 1.6;
`;

const TeamSection = styled.div`
  margin-top: ${theme.spacing.xxl};
  text-align: center;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const TeamMemberCard = styled(motion.div)`
  text-align: center;
`;

const TeamMemberImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${theme.layout.radius.full};
  background: ${theme.colors.gradient.primary};
  margin: 0 auto ${theme.spacing.lg};
  overflow: hidden;
`;

const TeamMemberName = styled.h4`
  color: ${theme.colors.accent.darkGray};
  font-size: ${theme.typography.body.sizes.regular};
  font-weight: ${theme.typography.body.weights.bold};
  margin-bottom: ${theme.spacing.xs};
`;

const TeamMemberRole = styled.p`
  color: ${theme.colors.accent.darkGray};
  opacity: 0.8;
  font-size: ${theme.typography.body.sizes.small};
`;

const features = [
  {
    icon: '🎨',
    title: 'AI Destekli Üretim',
    description: 'En son yapay zeka teknolojileri ile sanat eserleri oluşturun.',
  },
  {
    icon: '🌐',
    title: 'Global Erişim',
    description: 'Dünyanın her yerinden sanatçılar ve sanatseverlerle buluşun.',
  },
  {
    icon: '🔒',
    title: 'Güvenli Platform',
    description: 'Blockchain tabanlı güvenlik ile eserlerinizi koruyun.',
  },
  {
    icon: '💡',
    title: 'Yaratıcı Topluluk',
    description: 'İlham verici sanatçılarla etkileşime geçin ve deneyim paylaşın.',
  },
  {
    icon: '📱',
    title: 'Modern Arayüz',
    description: 'Kullanıcı dostu ve responsive tasarım ile her cihazda mükemmel deneyim.',
  },
  {
    icon: '🚀',
    title: 'Sürekli Gelişim',
    description: 'Düzenli güncellemeler ve yeni özellikler ile her zaman güncel kalın.',
  },
];

const teamMembers = [
  {
    name: 'Ali Yılmaz',
    role: 'Kurucu & CEO',
    image: '/team/ali.jpg',
  },
  {
    name: 'Ayşe Demir',
    role: 'Sanat Direktörü',
    image: '/team/ayse.jpg',
  },
  {
    name: 'Mehmet Kaya',
    role: 'Baş Geliştirici',
    image: '/team/mehmet.jpg',
  },
  {
    name: 'Zeynep Öz',
    role: 'AI Uzmanı',
    image: '/team/zeynep.jpg',
  },
];

export const About: React.FC = () => {
  return (
    <AboutContainer>
      <AboutContent>
        <AboutHeader>
          <AboutTitle
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Hakkımızda
          </AboutTitle>
          <AboutDescription
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Sanat Galerisi, yapay zeka ve sanatı bir araya getirerek yeni nesil bir sanat deneyimi sunuyor. 
            Amacımız, sanatçıları ve sanatseverleri modern teknolojilerle buluşturarak yaratıcılığın 
            sınırlarını genişletmek.
          </AboutDescription>
        </AboutHeader>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>

        <TeamSection>
          <AboutTitle
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Ekibimiz
          </AboutTitle>
          <AboutDescription
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Tutkulu ve deneyimli ekibimizle size en iyi deneyimi sunmak için çalışıyoruz.
          </AboutDescription>

          <TeamGrid>
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={member.name}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TeamMemberImage>
                  <img src={member.image} alt={member.name} />
                </TeamMemberImage>
                <TeamMemberName>{member.name}</TeamMemberName>
                <TeamMemberRole>{member.role}</TeamMemberRole>
              </TeamMemberCard>
            ))}
          </TeamGrid>
        </TeamSection>
      </AboutContent>
    </AboutContainer>
  );
};
