import { getLang } from 'libs/cookies';

const getBrowserLanguage = () => navigator.language.split('-')[0];

export const getUserLanguage = () => {
  const cookieLang = getLang();
  if (cookieLang) {
    return cookieLang;
  }
  return getBrowserLanguage();
};

export const languages = {
  cs: 'Čeština',
  da: 'Dansk',
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fi: 'Suomi',
  fr: 'Français',
  it: 'Italiano',
  ja: '日本語',
  nl: 'Nederlands',
  pl: 'Polski',
  pt: 'Português',
  sv: 'Svenska',
  tr: 'Türkçe',
  zh: '繁體中文',
};

export const availableLanguages = Object.keys(languages).sort();
