import { useState, useEffect, useCallback } from 'react';
import { cacheManager } from '../utils/cache';

type TranslationKey = string;
type LanguageCode = 'en' | 'tr';

interface Translations {
  [key: string]: any;
}

export function useTranslation() {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('language') as LanguageCode) || 'en';
  });

  const [translations, setTranslations] = useState<Translations>({});

  const loadTranslations = useCallback(async (lang: LanguageCode) => {
    try {
      // Check cache first
      const cachedTranslations = cacheManager.get<Translations>(`translations_${lang}`);
      if (cachedTranslations) {
        setTranslations(cachedTranslations);
        return;
      }

      // Load translations from file
      const response = await fetch(`/i18n/translations/${lang}.json`);
      const data = await response.json();
      
      // Cache the translations
      cacheManager.set(`translations_${lang}`, data, 24 * 60 * 60 * 1000); // 24 hours
      
      setTranslations(data);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  }, []);

  useEffect(() => {
    loadTranslations(language);
    localStorage.setItem('language', language);
  }, [language, loadTranslations]);

  const t = useCallback((key: TranslationKey, params?: Record<string, string>) => {
    const keys = key.split('.');
    let value = keys.reduce((obj, key) => obj?.[key], translations);

    if (!value) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        value = value.replace(`{{${key}}}`, val);
      });
    }

    return value;
  }, [translations]);

  const changeLanguage = (newLanguage: LanguageCode) => {
    setLanguage(newLanguage);
  };

  return { t, language, changeLanguage };
}
