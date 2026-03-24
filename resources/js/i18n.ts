import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export function initI18n(locale: string, translations: Record<string, unknown>): void {
    if (i18n.isInitialized) {
        i18n.changeLanguage(locale);
        i18n.addResourceBundle(locale, 'translation', translations, true, true);
        return;
    }

    i18n.use(initReactI18next).init({
        lng: locale,
        fallbackLng: 'en',
        resources: {
            [locale]: { translation: translations },
        },
        interpolation: {
            escapeValue: false,
        },
    });
}

export default i18n;
