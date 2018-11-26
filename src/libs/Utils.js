import moment from 'moment';
import tagsData from './../data/tags';

export const serverBaseURL = () => {
  if (process.env.REACT_APP_NODE_ENV === 'production') {
    return process.env.SERVER_BASE_URL || 'https://api.please.com';
  } else if (process.env.REACT_APP_NODE_ENV === 'staging') {
    return process.env.SERVER_BASE_URL || 'https://staging-api.please.com';
  } else {
    return process.env.SERVER_BASE_URL || 'https://api.please.docker';
  }
};

export default class Utils {
  static getBaseSymbol(currency = 'USD') {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'JPY':
        return '¥';
      case 'USD':
        return '$';
      case 'BTC':
        return 'Ƀ';
      case 'ETH':
        return 'Ξ';
      case 'PLS':
        return '🄿';
      default:
        return '$';
    }
  }
}

export const removeKey = (obj, propToDelete) => {
  const { [propToDelete]: deleted, ...objectWithoutDeletedProp } = obj;
  return objectWithoutDeletedProp;
};

// Comparator for sort function, that sorts the array while keeping all null/undefined values at the end
export const comparatorWithNullValues = (valueA, valueB) => {
  if (!valueA) return 1;
  else if (!valueB) return -1;
  else if (valueA === valueB) return 0;
  // because a & b both could be null/undefined
  else return valueA - valueB;
};

/**
 * This is a one-way diff,
 * meaning that it will return keys/values from object2 that are not identical to their counterparts in object1
 */
export const oneWayDiff = (object1, object2) => {
  return Object.keys(object2).reduce((diff, key) => {
    if (object1[key] === object2[key]) return diff;
    return {
      ...diff,
      [key]: object2[key],
    };
  }, {});
};

/* Does not work as expected */
export const uniqEs6 = arrArg => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) === pos;
  });
};

/**
 * A lot of times it's difficult to get the ISO date
 * out of the various date types we have
 * Thus this function
 */
export const getISODateString = date => {
  if (!date) return date;
  if (date.__type === 'Date') {
    return date.iso;
  } else if (date instanceof Date) {
    return date.toISOString();
  } else {
    return date;
  }
};

/**
 * @param {string} str The string to pad
 * @param {number} length what should be the final length of the string after padding
 * @param {string} padChar The string to fill in the padding area
 * @return {string}
 */
export const padStart = (str, length, padChar = '0') => {
  return (padChar.repeat(length) + str).slice(-length);
};

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const randBgColors = [
  '#7bbed6',
  '#82689a',
  '#75c1a5',
  '#ed837f',
  '#ffb777',
  '#19C2FF',
  '#00BCFF',
  '#B25C00',
  '#FF8300',
  '#ACB200',
  '#19FFAA',
];
export const tagsColorMatcher = tag => {
  let background =
    tagsData.filter(tagObj => tagObj.label === tag)[0] &&
    tagsData.filter(tagObj => tagObj.label === tag)[0].background;
  if (!background) {
    background = randBgColors[Math.floor(Math.random() * randBgColors.length)];
  }
  return background;
};

export const orderArrayByCustomField = (array, field) => {
  return array.sort(function(a, b) {
    return new Date(b[field]) - new Date(a[field]);
  });
};

/**
 * When using Formik forms, this method is useful to bulk check for required fields
 * @param {Object} values The Values provided by formik
 * @param {Array<string>} requiredFields The fields to check for required
 * @returns {Object} Errors in an object
 */
export function checkRequiredFields(values, requiredFields) {
  return requiredFields.reduce((errors, fieldName) => {
    const fieldValue = values[fieldName];
    if (fieldValue == null || fieldValue.length === 0 || fieldValue.size === 0)
      errors[fieldName] = 'Required';
    return errors;
  }, {});
}

/**
 * Given a trip it spits out
 * July 23, 2018 - July 25, 2018
 * @returns {string}
 */
export function getFormattedTripDates(trip) {
  const startMoment = moment(getISODateString(trip.beginDate));
  const endMoment = startMoment.clone().add(trip.dayCount, 'days');
  return `${startMoment.format('LL')} - ${endMoment.format('LL')}`;
}

/**
 * reloads the page
 */
export function reloadPage() {
  if (window && window.location && typeof window.location.reload === 'function') {
    window.location.reload();
  }
}

/**
 * Gets the large size image from the media array
 * @returns {string | undefined}
 */
export function getLargeImageFromMedia(media) {
  return media && media[0] && media[0].files && media[0].files.large && media[0].files.large.url;
}

/**
 * Gets latitude and longitude from trip or service coordinates
 * @param {Array<number>} coordinates An array of lat and lng
 * @returns {Object} An object with the coordinates
 */
export function getFromCoordinates(coordinates) {
  return {
    lat: coordinates[1] || null,
    lng: coordinates[0] || null,
  };
}

/**
 * Returns the price
 * @param {Number} base A number from which calculate the price with different operators
 * @param {Object} price An object with operator and value
 * @returns {Number} The resulting price
 */
export function getPriceFromServiceOption(base, price, peopleCount = 1) {
  if (!price) {
    return base * peopleCount;
  }

  if (typeof price === 'number') {
    return price;
  }

  if (price.operator === '+') {
    return price.value + base;
  }

  if (price.operator === '*') {
    return price.value * base;
  }

  return Number(price.value);
}

export function calculateBottomPosition(isGDPRDismissed, baseBottom = 0) {
  if (!isGDPRDismissed) {
    return baseBottom + document.getElementById('gdpr-banner').getBoundingClientRect().height;
  }
  return baseBottom;
}

export function getPeopleCount(trip) {
  return trip.adultCount + (trip.childrenCount || 0) + (trip.infantCount || 0);
}

/**
 * update bottom position
 */
export function updateBottomChatPosition(bottom = 0) {
  const chat = document.getElementById('fc_frame');
  if (chat) {
    chat.style.bottom = `${bottom + 15}px`;
    chat.style.zIndex = 15;
  }
}

/*
* Get hero image
*/
export function getHeroImage(service) {
  if (!service.media) {
    return null;
  }
  return service.media.find(media => media.hero === true) || service.media[0];
}
