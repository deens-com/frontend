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
  en: 'English',
  fr: 'French',
  sp: 'Spanish',
};
