import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import nl from '../locales/nl.json'
import en from '../locales/en.json'

export const resources = {
  nl: { translation: nl },
  en: { translation: en }
} as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'nl',
    fallbackLng: 'nl',
    supportedLngs: ['nl', 'en'],
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language'
    }
  })

export default i18n
