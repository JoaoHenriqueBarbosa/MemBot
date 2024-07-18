import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import ptBRTranslations from './locales/ptBR.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      ptBR: { translation: ptBRTranslations },
    },
    lng: 'ptBR', // Set Portuguese as the default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;
