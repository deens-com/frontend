import Cookies from 'js-cookie';

/**
 * Based on the cookies returns true/false
 * @returns {boolean}
 */
export const isStripeIntegrationEnabled = () => !!Cookies.get('stripe-integration');

/**
 * Enables/Disables stripe integration
 * @param {boolean} boolValue true to enable and false to disable
 */
export const enableStripeIntegration = boolValue => Cookies.set('stripe-integration', !!boolValue);
