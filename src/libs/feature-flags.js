import Cookies from 'js-cookie';

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
export const disableCryptoCurrencies = boolValue => Cookies.set(keys.cryptoCurrencies, !!boolValue);

/**
 * Based on the cookies returns true/false
 * @returns {boolean}
 */
export const isStripeIntegrationEnabled = () => convertToBool(Cookies.get(keys.stripeIntegration));

/**
 * Enables/Disables stripe integration
 * NOTE: while doing so it also disables crypto-currencies
 * @param {boolean} boolValue true to enable and false to disable
 */
export const enableStripeIntegration = boolValue => {
  Cookies.set(keys.stripeIntegration, !!boolValue);
  disableCryptoCurrencies(!!boolValue);
};
