import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
// Для обратной совместимости со старым кодом
import homeScreenTranslations, { HomeScreenTranslationKey } from './homeScreen';

/**
 * Тип для поддерживаемых языков
 */
export type Locale = 'en' | 'ru'; // Можно расширить при необходимости

/**
 * Тип для объекта переводов
 */
export type TranslationsObject<T extends string = string> = Record<Locale, Record<T, string>>;


/**
 * Хук для работы с переводами и смены языка (теперь глобально)
 * @param translations Объект переводов
 * @param defaultLang Язык по умолчанию
 * @returns Объект с функцией t для получения перевода, текущим языком и функцией смены языка
 */
export function useTranslation<T extends string>(
    translations: TranslationsObject<T>,
    defaultLang: Locale = 'en'
) {
  const { interfaceLanguageCode, setInterfaceLanguage, languages } = useLanguage();

  const t = useMemo(() => {
    return (key: T, lang?: Locale): string => {
      const currentLang = lang || (interfaceLanguageCode as Locale) || defaultLang;
      return translations[currentLang]?.[key] || translations[defaultLang]?.[key] || key;
    };
  }, [translations, defaultLang, interfaceLanguageCode]);

  // Backward compatibility wrapper for setLanguage
  const setLanguage = async (languageCode: Locale) => {
    // Use languages from context if available, otherwise fallback to hardcoded
    const availableLanguages = languages.length > 0 ? languages : [
      { id: 1, code: 'en' },
      { id: 2, code: 'ru' }
    ];
    const language = availableLanguages.find(l => l.code === languageCode);
    if (language) {
      await setInterfaceLanguage(language.id);
    }
  };

  return { 
    t, 
    language: (interfaceLanguageCode as Locale) || defaultLang, 
    setLanguage 
  };
}

// Для обратной совместимости со старым кодом
export function t(key: HomeScreenTranslationKey, lang: Locale = 'ru'): string {
  return homeScreenTranslations[lang]?.[key] || homeScreenTranslations['ru'][key] || key;
}
