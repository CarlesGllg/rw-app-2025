
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import esTranslation from '../locales/es/translation.json';
import caTranslation from '../locales/ca/translation.json';

const resources = {
  es: {
    translation: esTranslation,
  },
  ca: {
    translation: caTranslation,
  },
};

// Initialize i18n synchronously to prevent React rendering issues
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    // Add these options to ensure synchronous initialization
    initImmediate: false,
    react: {
      useSuspense: false,
    },
  });

export default i18n;
