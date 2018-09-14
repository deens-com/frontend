import i18next from 'i18next';

i18next.init({
  interpolation: {
    // React already does escaping
    escapeValue: false,
  },
  lng: 'en', // 'en' | 'es'
  // Using simple hardcoded resources for simple example
  resources: {
    en: {
      translation: {
        places: { label: 'Accomodations', singular: 'Accomodation' },
        activities: { label: 'Activities', singular: 'Activity' },
        foods: { label: 'Food', singular: 'Food' },
        trips: { label: 'Trips', singular: 'Trip' },
        earnMoney: { label: 'Earn Money' },
      },
    },
    // es: {
    //   translation: {
    //     places: { label: '', },
    //     activities: { label: 'Casa', },
    //     foods: { label: 'Nombre', },
    //   },
    //},
  },
});

export default i18next;
