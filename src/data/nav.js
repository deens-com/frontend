import i18n from './../libs/i18n';

export const mainNav = [
  { label: i18n.t('trips.label'), href: '/results?service_types=trip', service_type: 'trip' },
  { label: i18n.t('places.singular'), href: '/results?service_types=place', service_type: 'place' },
  {
    label: i18n.t('activities.label'),
    href: '/results?service_types=activity',
    service_type: 'activity',
  },
  { label: i18n.t('foods.label'), href: '/results?service_types=food', service_type: 'food' },
];

export const languages = [
  { value: 'eng', label: 'ENG' },
  { value: 'es', label: 'ES' },
  { value: 'fr', label: 'FR' },
];

export const currencies = [
  { value: 'USD', label: '$ (USD)' },
  { value: 'EUR', label: '€ (EUR)' },
  { value: 'JPY', label: '¥ (JPY)' },
  { value: 'GBP', label: '£ (GBP)' },
  { value: 'BTC', label: 'Ƀ (BTC)' },
  { value: 'ETH', label: 'Ξ (ETH)' },
  { value: 'PLS', label: '🄿 (PLS)' },
];
