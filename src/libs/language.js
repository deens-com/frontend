import { getLang, setLang } from 'libs/cookies';

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

const prismicLanguages = {
  en: 'en-us',
  es: 'es-ar',
  fr: 'fr-fr',
};

export const mapLangToPrismicLang = lang => prismicLanguages[lang] || 'en-us';

export const availableLanguages = Object.keys(languages).sort();

const getRouteLanguage = () => {
  const urlLang = window.location.pathname.split('/')[1];
  if (urlLang.length !== 2) {
    return 'en';
  }
  return urlLang;
};

const getBrowserLanguage = () =>
  navigator.language ? navigator.language.split('-')[0] : getRouteLanguage();

const userLanguage = (() => {
  const cookieLang = getLang();
  if (cookieLang) {
    return cookieLang;
  }
  const lang = getBrowserLanguage();
  if (!(lang in languages)) {
    setLang('en');
    return 'en';
  }
  setLang(lang);
  return lang;
})();

export const getUserLanguage = () => userLanguage;
