import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationFR from "./locales/fr/translation.json";

// Translation resources
const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
};

i18n
  .use(initReactI18next) // Bind react-i18next to the instance
  .init({
    resources,
    lng: navigator.language.split("-")[0] || "fr", // Detect browser language
    fallbackLng: "fr", // Fallback language if translation is missing
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
