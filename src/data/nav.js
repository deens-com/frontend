import i18n from 'libs/i18n';

export const mainNav = [
  { label: i18n.t('trips.label'), href: '/results?type=trip', service_type: 'trip' },
  {
    label: i18n.t('places.singular'),
    href: '/results?type=accommodation',
    service_type: 'place',
  },
  {
    label: i18n.t('activities.label'),
    href: '/results?type=activity',
    service_type: 'activity',
  },
  { label: i18n.t('foods.label'), href: '/results?type=food', service_type: 'food' },
];

export const languages = [
  { value: 'eng', label: 'ENG' },
  { value: 'es', label: 'ES' },
  { value: 'fr', label: 'FR' },
];

export const fiatCurrencies = [
  { value: 'USD', label: '$ (USD)', stripeMultiplier: 100 },
  { value: 'EUR', label: '€ (EUR)', stripeMultiplier: 100 },
  { value: 'JPY', label: '¥ (JPY)', stripeMultiplier: 1 },
  { value: 'GBP', label: '£ (GBP)', stripeMultiplier: 100 },
];

// export const cryptoCurrencies = [
//   { value: 'BTC', label: 'Ƀ (BTC)' },
//   { value: 'ETH', label: 'Ξ (ETH)' },
//   { value: 'PLS', label: '🄿 (PLS)' },
// ];

export const currencies = fiatCurrencies;
