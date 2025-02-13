import { motion } from 'framer-motion';
import { AIWorkshop } from '@/components/workshop/AIWorkshop';
import { useTranslation } from 'react-i18next';

export default function AIWorkshopPage() {
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
            {t('workshop.title')}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('workshop.description')}
          </p>
        </div>

        <AIWorkshop />
      </div>
    </motion.div>
  );
}
