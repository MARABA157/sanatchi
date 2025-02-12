import { motion } from 'framer-motion';
import { ArtAnalysisChat } from '@/components/chat/ArtAnalysisChat';
import { useTranslation } from 'react-i18next';

export default function AIChatPage() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 bg-black min-h-screen py-20"
    >
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
            {t('chat.title')}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('chat.description')}
          </p>
        </div>

        <ArtAnalysisChat />
      </div>
    </motion.div>
  );
}
