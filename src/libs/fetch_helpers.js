import I18nText from 'shared_components/I18nText'
import { tagsColorMatcher } from './Utils';
import placeholder from './../assets/placeholder350x350.svg';

const normalizeParseResponseData = data => {
  let dataInJsonString = JSON.stringify(data);
  return JSON.parse(dataInJsonString);
};

const generateFiles = url => ({
  original: {
    url,
  },
});

export const parseLocation = location =>
  location
    ? `${location.city ? location.city : ''}${
        location.country ? ', ' + location.country.names['en-us'] : ''
      }`
    : '';

export const parseTags = tags =>
  tags.map(tag => {
    const i18nLocale = 'en-us';
    const tagBg = tagsColorMatcher(I18nText.translate(tag.names));
    return {
      id: tag._id,
      label: tag.names[i18nLocale].charAt(0).toUpperCase() + tag.names[i18nLocale].slice(1),
      hoverBg: tagBg,
      background: tagBg,
    };
  });

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const get_service_image = mediaOrMainPicture => {
  if (
    !mediaOrMainPicture ||
    (mediaOrMainPicture instanceof Array && mediaOrMainPicture.length === 0)
  ) {
    return placeholder;
  }
  if (typeof mediaOrMainPicture === 'string') return mediaOrMainPicture;
  if (mediaOrMainPicture instanceof Array) return mediaOrMainPicture[0];
  return mediaOrMainPicture.url;
};

const formatAddressLine = location => {
  if (location.address_components[1]) {
    return `${location.address_components[0].long_name} ${
      location.address_components[1].long_name
    }`;
  }
  return location.address_components[0].long_name;
};

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const mapImage = (image, i) => {
  if (typeof image === 'object' && !image.url) {
    return image;
  }
  const url = image.url || image;

  return {
    type: 'image',
    hero: Boolean(image.hero),
    names: {
      'en-us': `Image ${i}`,
    },
    files: generateFiles(url),
  };
};

const createService = (values, custom) => {
  const i18nLocale = 'en-us';
  return {
    isCustom: Boolean(custom),
    categories: [
      {
        names: {
          [i18nLocale]: values.category,
        },
      },
    ],
    tags: values.tags,
    ...(values.subtitle && {subtitle: { [i18nLocale]: values.subtitle }}),
    title: { [i18nLocale]: values.title },
    basePrice: values.basePrice,
    location: {
      line1: formatAddressLine(values.location) || values.formattedAddress,
      line2: '',
      postcode: values.postCode,
      city: values.city,
      state: values.state,
      countryCode: values.countryCode,
      geo: {
        coordinates: [values.latlong.lng, values.latlong.lat],
        type: 'Point',
      },
      formattedAddress: values.formattedAddress,
      id: values.location.place_id,
    },
    media: values.media.map(mapImage),
    ...(values.description && {description: { [i18nLocale]: values.description }}),
    ...(!custom
      ? {
          instructions: {
            ...(values.start ? { start: { [i18nLocale]: values.start } } : {}),
            ...(values.end ? { end: { [i18nLocale]: values.end } } : {}),
          },
          rules: values.rules.filter(rule => Boolean(rule)).map(rule => ({ [i18nLocale]: rule })),
          duration: (values.category === 'Accommodation' ? 1 : values.duration),
          baseCurrency: {
            name: 'US Dollar',
            code: 'USD',
            symbol: '$',
          },
          periods: [
            {
              startDate: new Date(values.startDate.setHours(0, 0, 0, 0)),
              endDate: new Date(values.endDate.setHours(0, 0, 0, 0)),
              startTime: values.openingTime,
              endTime: values.closingTime,
              maxCapacity: values.slots,
              daysOfWeek: weekdays.reduce(
                (prev, day) => ({
                  ...prev,
                  [day]: values.availableDays.includes(day),
                }),
                {},
              ),
              cancellable: values.refundType !== 'none',
              ...(values.refundType !== 'none'
                ? {
                    cancellationPolicies: [
                      {
                        duration: Number(values.refundDuration) * 24 * 60, // To minutes
                        refundType: values.refundType,
                        refundAmount: Number(values.refundAmount),
                      },
                    ],
                  }
                : null),
            },
          ],
          links: {
            website: values.website,
            facebook: values.facebook,
            twitter: values.twitter,
          },
        }
      : {}),
  };
};

const buildServiceForView = service => {
  const i18nLocale = 'en-us';

  try {
    service.title = service.title[i18nLocale];
    service.subtitle = service.subtitle[i18nLocale];
    service.description = service.description[i18nLocale];
    service.objectId = service._id;
    service.ratings = service.ratings;
    service.duration = service.duration;
    service.refundType = 'none';
    if (service.rules && service.rules.length) {
      const rules = service.rules.map(rule => rule[i18nLocale]);
      service.rules = rules;
    }
    if (service.periods && service.periods[0]) {
      service.dayList = Object.keys(service.periods[0].daysOfWeek).filter(
        k => service.periods[0].daysOfWeek[k],
      );
      service.startDate = new Date(service.periods[0].startDate);
      service.endDate = new Date(service.periods[0].endDate);
      service.openingTime = service.periods[0].startTime;
      service.closingTime = service.periods[0].endTime;
      service.slots = service.periods[0].maxCapacity;

      if (
        service.periods[0].cancellationPolicies &&
        service.periods[0].cancellationPolicies.length > 0
      ) {
        service.refundType = service.periods[0].cancellationPolicies[0].refundType;
        service.refundDuration = Math.round(
          service.periods[0].cancellationPolicies[0].duration / 24 / 60,
        ); // Minutes to days
        service.refundAmount = service.periods[0].cancellationPolicies[0].refundAmount;
      }
    }
    if (service.instructions) {
      service.start = service.instructions.start && service.instructions.start[i18nLocale];
      service.end = service.instructions.end && service.instructions.end[i18nLocale];
    }
    if (service.links) {
      service.facebook = service.links.facebook;
      service.twitter = service.links.twitter;
      service.website = service.links.website;
    }
    if (service.location) {
      service.formattedAddress = service.location.formattedAddress;
    }
    service.externalUrl = service.externalUrl && service.externalUrl[i18nLocale];
    if (service.categories && service.categories.length) {
      const categories = service.categories.map(category => category.names[i18nLocale]);
      service.category = categories[0];
    }
  } catch (error) {
    console.log(error);
  }
  return service;
};

const normalizeServiceToPatch = createService;

const buildServicesJson = services => {
  const i18nLocale = 'en-us';
  return services.map(service => {
    try {
      service.excerpt = service.description ? service.description[i18nLocale] : '';
      service.description = service.excerpt;
      service.title = service.title[i18nLocale];
      service.subtitle = service.subtitle ? service.subtitle[i18nLocale] : '';
      service.startInstructions =
        service.instructions && service.instructions.start
          ? service.instructions.start[i18nLocale]
          : '';
      service.endInstructions =
        service.instructions && service.instructions.end
          ? service.instructions.end[i18nLocale]
          : '';
      service.rules = service.rules && service.rules.map(rule => rule[i18nLocale]);
      service.name = service.title;
      service.objectId = service._id;
      service.geo = {
        lat: (service.location && service.location.geo && service.location.geo.coordinates[1]) || 1,
        lng: (service.location && service.location.geo && service.location.geo.coordinates[0]) || 1,
      };
      // eslint-disable-next-line
      service.latitude = (service.location && service.location.latitude) || 1;
      // eslint-disable-next-line
      service.longitude = (service.location && service.location.longitude) || 1;
      // const country =
      //   service.location && service.location.country && service.location.country.names[i18nLocale];
      service.type = service.categories && service.categories[0].names[i18nLocale];
      service.originalLocation = service.location;
      service.location = parseLocation(service.location);
      service.ratings = service.ratings;
      service.slots = service.slots;
      service.price = service.price == null ? service.pricePerSession : service.price;
      service.pricePerSession = service.pricePerSession || service.basePrice;
      service.openingTime = (service.periods && service.periods[0].startTime) || '00';
      service.closingTime = (service.periods && service.periods[0].endTime) || '23';
      if (service.tags && service.tags.length && service.tags[0].type) {
        service.tags = parseTags(service.tags);
      }
      if (service.type === undefined) {
        if (service.picture) {
          if (typeof service.picture._url === 'string') service.image = service.picture._url;
          if (typeof service.picture.url === 'string') service.image = service.picture.url;
        }
        service.image = service.image || 'https://dummyimage.com/600x400/000/fff';
      } else {
        service.image = get_service_image(service.mainPicture);
      }
      service.mainPicture = service.mainPicture || service.image;
    } catch (error) {
      console.log(error);
    }
    return service;
  });
};

const buildUserJson = user => {
  if (user.plsBalance.$numberDecimal) {
    user.plsBalance = user.plsBalance.$numberDecimal;
  }
  return user;
};

// This function should be rewritten when redesigning the service page
const mapServiceObjects = services => {
  return services.map(service => {
    try {
      service.excerpt = service.description;
      service.title = service.name || service.title;
      // eslint-disable-next-line
      service.latitude = (service.location && service.location.latitude) || 1;
      // eslint-disable-next-line
      service.longitude = (service.location && service.location.longitude) || 1;
      service.location = `${service.city ? service.city + ',' : ''} ${service.country}`;
      service.ratings = service.ratings;
      service.slots = service.slots;
      service.price = service.price == null ? service.pricePerSession : service.price;
      if (service.tags && service.tags.length) {
        const tags = service.tags.map(tag => {
          const tagBg = tagsColorMatcher(tag);
          return { label: tag, hoverBg: tagBg, background: tagBg };
        });
        service.tags = tags;
      }
      if (service.type === undefined) {
        if (service.picture) {
          if (typeof service.picture._url === 'string') service.image = service.picture._url;
          if (typeof service.picture.url === 'string') service.image = service.picture.url;
        }
        service.image = service.image;
      } else {
        service.image = get_service_image(service.media);
      }
    } catch (error) {
      console.log(error);
    }
    return service;
  });
};

const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};

export const statuses = {
  STARTED: 'started',
  SUCCESS: 'success',
  ERROR: 'error',
};

const createServiceFromUrl = data => {
  const i18nLocale = 'en-us';

  return {
    ...data,
    title: {
      [i18nLocale]: data.title,
    },
    subtitle: {
      [i18nLocale]: '',
    },
    description: {
      [i18nLocale]: data.description,
    },
    media: data.images.map((image, i) => ({
      type: 'image',
      hero: i === 0,
      files: generateFiles(image.url || image),
      names: {
        [i18nLocale]: `Image ${i}`,
      },
    })),
  };
};

export default {
  normalizeParseResponseData,
  normalizeServiceToPatch,
  createService,
  buildServiceForView,
  getRandomInt,
  get_service_image,
  mapServiceObjects,
  buildServicesJson,
  removeDuplicates,
  statuses,
  buildUserJson,
  createServiceFromUrl,
};
