import Cookies from 'js-cookie';
import { reloadPage } from './Utils';

window.Cookies = Cookies;

export const keys = {
  stripeIntegration: 'stripe-integration',
  cryptoCurrencies: 'disable-crypto-currencies',
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
