import {I18n} from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './translations/en';
import ru from './translations/ru';
import loginScreenTranslations from './translations/loginScreen';
import registerScreenTranslation from './translations/registerScreen';
import profileScreenTranslation from './translations/profileScreen';
import practiceScreenTranslation from './translations/practiceScreen';
import indexScreenTranslation from './translations/indexScreen';
import tabsTranslations from './translations/tabs';

function deepMerge(target: any, source: any) {
  for (const key of Object.keys(source)) {
    if (
        source[key] instanceof Object &&
        key in target &&
        target[key] instanceof Object
    ) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  return {...target, ...source};
}

const mergedEn = deepMerge(
    deepMerge(
        deepMerge(
            deepMerge(
                deepMerge(
                    deepMerge(en, loginScreenTranslations.en),
                    registerScreenTranslation.en),
                profileScreenTranslation.en),
            practiceScreenTranslation.en),
        indexScreenTranslation.en),
    tabsTranslations.en);
const mergedRu = deepMerge(
    deepMerge(
        deepMerge(
            deepMerge(
                deepMerge(
                    deepMerge(ru, loginScreenTranslations.ru),
                    registerScreenTranslation.ru),
                profileScreenTranslation.ru),
            practiceScreenTranslation.ru),
        indexScreenTranslation.ru),
    tabsTranslations.ru);
console.log('[i18n] Merged EN translations:', mergedEn);
console.log('[i18n] Merged RU translations:', mergedRu);

const i18n = new I18n({
  en: mergedEn,
  ru: mergedRu,
});

i18n.defaultLocale = 'ru';
i18n.locale = Localization.locale.split('-')[0];
console.log('[i18n] Set locale:', i18n.locale);
i18n.enableFallback = true;
console.log('[i18n] i18n initialized:', {
  defaultLocale: i18n.defaultLocale,
  locale: i18n.locale,
  enableFallback: i18n.enableFallback,
});

export default i18n;
