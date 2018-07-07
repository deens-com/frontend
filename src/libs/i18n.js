import i18next from 'i18next';

i18next
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: 'en', // 'en' | 'es'
    // Using simple hardcoded resources for simple example
    resources: {
      en: {
        translation: {
          places: { label: 'Accommodations', },
          activities: { label: 'Activities', },
          foods: { label: 'Food', },
          trips: { label: 'Trips', },
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
  })

export default i18next;
