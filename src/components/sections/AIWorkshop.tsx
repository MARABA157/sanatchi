import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';

const WorkshopContainer = styled.section`
  min-height: 100vh;
  background: ${theme.colors.gradient.dark};
  padding: ${theme.spacing.xxl} 0;
  color: ${theme.colors.primary.white};
`;

const WorkshopContent = styled.div`
  max-width: ${theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing.xl};
`;

const WorkshopHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xxl};
`;

const WorkshopTitle = styled(motion.h2)`
  font-size: ${theme.typography.heading.sizes.h2};
  margin-bottom: ${theme.spacing.lg};
  background: ${theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const WorkshopDescription = styled(motion.p)`
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.8;
`;

const WorkspaceContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xxl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ControlPanel = styled(motion.div)`
  background: ${theme.effects.glassmorphism.background};
  backdrop-filter: ${theme.effects.glassmorphism.backdropFilter};
  border: ${theme.effects.glassmorphism.border};
  border-radius: ${theme.layout.radius.lg};
  padding: ${theme.spacing.xl};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const Tab = styled(motion.button)<{ isActive: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.layout.radius.full};
  background: ${props => props.isActive ? theme.colors.primary.gold : 'transparent'};
  color: ${props => props.isActive ? theme.colors.primary.white : theme.colors.primary.white};
  opacity: ${props => props.isActive ? 1 : 0.6};
  font-weight: ${theme.typography.body.weights.medium};
`;

const InputGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.sm};
  opacity: 0.8;
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.layout.radius.md};
  color: ${theme.colors.primary.white};

  &:focus {
    border-color: ${theme.colors.primary.gold};
    outline: none;
  }
`;

const Textarea = styled(Input).attrs({ as: 'textarea' })`
  height: 120px;
  resize: none;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: ${theme.spacing.md};
  background: ${theme.colors.primary.gold};
  color: ${theme.colors.primary.white};
  border-radius: ${theme.layout.radius.md};
  font-weight: ${theme.typography.body.weights.bold};
  margin-top: ${theme.spacing.lg};
`;

const PreviewPanel = styled(motion.div)`
  background: ${theme.effects.glassmorphism.background};
  backdrop-filter: ${theme.effects.glassmorphism.backdropFilter};
  border: ${theme.effects.glassmorphism.border};
  border-radius: ${theme.layout.radius.lg};
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
`;

const PreviewCanvas = styled.div`
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: ${theme.layout.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const PreviewControls = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`;

const PreviewButton = styled(Button)`
  flex: 1;
  margin-top: 0;
`;

export const AIWorkshop: React.FC = () => {
  const [activeTab, setActiveTab] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // AI üretim mantığı burada olacak
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const tabs = [
    { id: 'image', label: 'Görsel' },
    { id: 'video', label: 'Video' },
    { id: 'music', label: 'Müzik' },
  ];

  return (
    <WorkshopContainer>
      <WorkshopContent>
        <WorkshopHeader>
          <WorkshopTitle
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            AI Workshop
          </WorkshopTitle>
          <WorkshopDescription
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Yapay zeka ile kendi sanat eserlerinizi oluşturun. Görsel, video ve müzik üretmek için AI asistanımızı kullanın.
          </WorkshopDescription>
        </WorkshopHeader>

        <WorkspaceContainer>
          <ControlPanel
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <TabContainer>
              {tabs.map(tab => (
                <Tab
                  key={tab.id}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabContainer>

            <InputGroup>
              <Label>Prompt</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Sanat eserinizi tanımlayın..."
              />
            </InputGroup>

            <InputGroup>
              <Label>Stil</Label>
              <Input
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="Örn: empresyonist, minimalist..."
              />
            </InputGroup>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGenerating ? 'Üretiliyor...' : 'Oluştur'}
            </Button>
          </ControlPanel>

          <PreviewPanel
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PreviewCanvas>
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  ⚙️
                </motion.div>
              ) : (
                <p>Önizleme burada görünecek</p>
              )}
            </PreviewCanvas>

            <PreviewControls>
              <PreviewButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                İndir
              </PreviewButton>
              <PreviewButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Paylaş
              </PreviewButton>
            </PreviewControls>
          </PreviewPanel>
        </WorkspaceContainer>
      </WorkshopContent>
    </WorkshopContainer>
  );
};
