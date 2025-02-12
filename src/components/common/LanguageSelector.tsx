import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { motion } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
];

const LanguageSelector: React.FC = () => {
  const { language, changeLanguage } = useTranslation();

  return (
    <div className="relative inline-block text-left">
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value as 'en' | 'tr')}
        className="block w-full px-4 py-2 text-sm text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {languages.map((lang) => (
          <motion.option
            key={lang.code}
            value={lang.code}
            className="py-2"
            whileHover={{ scale: 1.02 }}
          >
            {`${lang.flag} ${lang.name}`}
          </motion.option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
