import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import vi from './vi.json';
import en from './en.json';

const deviceLanguage = getLocales()[0]?.languageCode ?? 'vi';

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    en: { translation: en },
  },
  lng: deviceLanguage,
  fallbackLng: 'vi',
  interpolation: { escapeValue: false },
});

export default i18n;
