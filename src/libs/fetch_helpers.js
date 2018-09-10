import Parse from 'parse';
import { tagsColorMatcher } from './Utils';

const normalizeParseResponseData = data => {
  let dataInJsonString = JSON.stringify(data);
  return JSON.parse(dataInJsonString);
};

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
    return 'https://dummyimage.com/600x400/000/fff';
  }
  if (typeof mediaOrMainPicture === 'string') return mediaOrMainPicture;
  if (mediaOrMainPicture instanceof Array) return mediaOrMainPicture[0];
  return mediaOrMainPicture.url;
};

const createService = values => {
  const i18nLocale = 'en-us';

  try {
    values.title = values.title;
    values.categories = values.categories.map(category => ({
      names: {
        [i18nLocale]: category,
      },
    }));
    values.periods = [
      {
        startDate: '2018-07-06T00:00:00.000Z',
        endDate: '2019-07-06T00:00:00.000Z',
        startTime: values.openingTime,
        endTime: values.closingTime,
        daysOfWeek: values.availableDays.reduce((accum, day) => {
          const lowerCaseDay = day.weekday.toLowerCase();
          if (!accum[lowerCaseDay]) {
            accum[lowerCaseDay] = day.selected;
          }
          return accum;
        }, {}),
        price: {
          min: 8,
          max: 12,
        },
        priceCapacity: 2,
        minCapacity: 1,
        maxCapacity: 3,
        cancellationPolicies: {
          duration: 24,
          refundAmount: 75,
          refundType: 'fixed',
        },
      },
    ];
    values.status = 'active';
    values.basePrice = values.basePrice;
    values.location = {
      line1: `${values.location.address_components[0].long_name} ${
        values.location.address_components[1].long_name
      }`,
      line2: '',
      postcode: values.location.address_components[7].long_name,
      city: values.location.address_components[3].long_name,
      state: values.location.address_components[5].short_name,
      countryCode: values.location.address_components[6].short_name,
      country: {
        names: {
          [i18nLocale]: values.location.address_components[6].long_name,
        },
      },
      geo: {
        coordinates: [values.latlong.lng, values.latlong.lat],
        type: 'Point',
      },
      formattedAddress: values.formattedAddress,
    };
    values.baseCurrency = {
      name: 'US Dollar',
      code: 'USD',
      symbol: '$',
    };
    values.description = { [i18nLocale]: values.description };
    values.duration = values.duration;
    values.instructions = {
      start: { [i18nLocale]: values.start },
      end: { [i18nLocale]: values.end },
    };
    values.rules = values.rules.map(rule => ({ [i18nLocale]: rule }));
    values.subtitle = { [i18nLocale]: values.subtitle };
    values.title = { [i18nLocale]: values.title };
    values.links = {
      website: values.website,
      facebook: values.facebook,
      twitter: values.twitter,
    };
    values.otherAttributes = {
      driver_licence: {
        type: 'private',
        names: {
          [i18nLocale]: '123AZERT456',
        },
      },
      car_color: {
        type: 'public',
        names: {
          [i18nLocale]: 'Black',
        },
      },
    };
    values.externalUrl = {
      [i18nLocale]: values.externalUrl,
    };
  } catch (error) {
    console.log(error);
  }

  return values;
};

const buildService = service => {
  const i18nLocale = 'en-us';
  let dayList = [];

  try {
    for (const key in service.periods[0].daysOfWeek) {
      const selected = service.periods[0].daysOfWeek[key];
      const capitalized = key.charAt(0).toUpperCase() + key.substr(1);
      dayList = [...dayList, { weekday: capitalized, selected }];
    }
    service.title = service.title[i18nLocale];
    service.subtitle = service.subtitle[i18nLocale];
    service.description = service.description[i18nLocale];
    service.objectId = service._id;
    service.rating = service.rating;
    service.duration = service.duration;
    service.dayList = dayList;
    if (service.rules && service.rules.length) {
      const rules = service.rules.map(rule => rule[i18nLocale]);
      service.rules = rules;
    }
    service.start = service.instructions.start[i18nLocale];
    service.end = service.instructions.end[i18nLocale];
    service.facebook = service.links.facebook;
    service.twitter = service.links.twitter;
    service.website = service.links.website;
    service.openingTime = service.periods[0].startTime;
    service.closingTime = service.periods[0].endTime;
    service.reviewCount = service.reviewCount;
    service.slots = service.periods[0].maxCapacity;
    service.formattedAddress = service.location.formattedAddress;
    service.externalUrl = service.externalUrl[i18nLocale];
    if (service.categories && service.categories.length) {
      const categories = service.categories.map(category =>
        category.names[i18nLocale].toLowerCase(),
      );
      service.categories = categories;
    }
    if (service.tags && service.tags.length) {
      const tags = service.tags.map(tag => tag.names[i18nLocale]);
      service.tags = tags;
    }
  } catch (error) {
    console.log(error);
  }
  return service;
};

const normalizeServiceToPatch = values => {
  const i18nLocale = 'en-us';
  console.log(values.location);
  try {
    values.acceptETH = values.acceptETH;
    values.title = { [i18nLocale]: values.title };
    values.description = { [i18nLocale]: values.description };
    values.externalUrl = { [i18nLocale]: values.externalUrl };
    values.baseCurrency = {
      name: 'US Dollar',
      code: 'USD',
      symbol: '$',
    };
    values.location = {
      line1: `${values.location.address_components[0].long_name} ${
        values.location.address_components[1].long_name
      }`,
      line2: '',
      postcode: values.location.address_components[7].long_name,
      city: values.location.address_components[3].long_name,
      state: values.location.address_components[5].short_name,
      countryCode: values.location.address_components[6].short_name,
      geo: {
        coordinates: [values.latlong.lng, values.latlong.lat],
        type: 'Point',
      },
    };
    values.instructions = {
      start: { [i18nLocale]: values.start },
      end: { [i18nLocale]: values.end },
    };
    values.rules = values.rules.map(rule => ({ [i18nLocale]: rule }));
    values.subtitle = { [i18nLocale]: values.subtitle };
    values.links = {
      facebook: values.facebook,
      twitter: values.twitter,
      website: values.website,
    };
    values.categories = values.categories.map(category => ({
      names: {
        [i18nLocale]: category,
      },
    }));
    values.periods = [
      {
        cancellationPolicies: [],
        startDate: '2018-07-09T18:30:00.000Z',
        endDate: '2019-12-09T18:30:00.000Z',
        startTime: 10,
        endTime: 22,
        daysOfWeek: values.availableDays.reduce((accum, day) => {
          const lowerCaseDay = day.weekday.toLowerCase();
          if (!accum[lowerCaseDay]) {
            accum[lowerCaseDay] = day.selected;
          }
          return accum;
        }, {}),
        price: {
          min: 30,
          max: 50,
        },
        priceCapacity: 1,
        minCapacity: 1,
        maxCapacity: 2,
      },
    ];
  } catch (error) {
    console.log(error);
  }
  return values;
};

const buildServicesJson = services => {
  const i18nLocale = 'en-us';
  return services.map(service => {
    try {
      service.excerpt = service.description[i18nLocale];
      service.description = service.excerpt;
      service.title = service.title[i18nLocale];
      service.name = service.title;
      service.objectId = service._id;
      // eslint-disable-next-line
      service.latitude = (service.location && service.location.latitude) || 1;
      // eslint-disable-next-line
      service.longitude = (service.location && service.location.longitude) || 1;
      service.location = `${service.city ? service.city + ',' : ''} ${service.country}`;
      service.rating = service.rating;
      service.reviewCount = service.reviewCount;
      service.slots = service.slots;
      service.price = service.price == null ? service.pricePerSession : service.price;
      service.pricePerSession = service.pricePerSession || service.basePrice;
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

const buildServicesJson = services => {
  const i18nLocale = 'en-us';
  return services.map(service => {
    try {
      service.excerpt = service.description[i18nLocale];
      service.description = service.excerpt;
      service.title = service.title[i18nLocale];
      service.name = service.title;
      service.objectId = service._id;
      // eslint-disable-next-line
      service.latitude = (service.location && service.location.latitude) || 1;
      // eslint-disable-next-line
      service.longitude = (service.location && service.location.longitude) || 1;
      service.location = `${service.city ? service.city + ',' : ''} ${service.country}`;
      service.rating = service.rating;
      service.reviewCount = service.reviewCount;
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
        service.image = service.image || 'https://dummyimage.com/600x400/000/fff';
      } else {
        service.image = get_service_image(service.mainPicture);
      }
    } catch (error) {
      console.log(error);
    }
    return service;
  });
};

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
      service.rating = service.rating;
      service.reviewCount = service.reviewCount;
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

const build_query = model => {
  let Model = Parse.Object.extend(model);
  let query = new Parse.Query(Model);
  return query;
};

export const statuses = {
  STARTED: 'started',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default {
  normalizeParseResponseData,
  normalizeServiceToPatch,
  createService,
  buildService,
  getRandomInt,
  get_service_image,
  mapServiceObjects,
  buildServicesJson,
  removeDuplicates,
  build_query,
  statuses,
};
