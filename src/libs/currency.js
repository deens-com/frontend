import round from 'lodash.round';

export const plsValue = 0.036;

export const usdToPls = usdAmount => {
  return round(usdAmount / plsValue, 8);
};
