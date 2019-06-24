import Cookies from 'js-cookie';
import { reloadPage } from './Utils';

window.Cookies = Cookies;

export const keys = {
  stripeIntegration: 'stripe-integration',
  cryptoCurrencies: 'disable-crypto-currencies',
  gdprDismissed: 'gdpr-dismissed',
  lang: 'language',
};

const convertToBool = stringBool => stringBool === 'true';

/**
 * Checks if crypto-currencies should be shown or not
 * @returns {boolean}
 */
export const isCryptoCurrenciesDisabled = () => convertToBool(Cookies.get(keys.cryptoCurrencies));

/**
 * Enables/Disables crypto-currencies on the site
 */
export const disableCryptoCurrencies = boolValue => {
  Cookies.set(keys.cryptoCurrencies, !!boolValue);
  reloadPage();
};

/**
 * Dismiss GDPR banner
 */
export const dismissGDPRBanner = () => {
  Cookies.set(keys.gdprDismissed, true);
};

export const isGDPRDismissed = () => convertToBool(Cookies.get(keys.gdprDismissed));

export const setLang = language => {
  Cookies.set(keys.lang, language);
};

export const getLang = () => {
  return Cookies.get(keys.lang);
};
