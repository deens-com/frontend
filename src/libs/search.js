import queryString from 'qs';
import moment from 'moment';
import apiClient from 'libs/apiClient';
import isEqual from 'lodash.isequal';

export function getAddress(params) {
  if (params.text) {
    return params.text;
  }
  if (params.address) {
    return params.address;
  }
  if (params.city) {
    if (params.countryCode) {
      return `${params.city}, ${params.countryCode}`;
    }
    return params.city;
  }
  if (params.countryCode) {
    return params.countryCode;
  }
}

const parseArrayOrString = field => {
  if (!field) {
    return undefined;
  }
  if (typeof field === 'string') {
    return field.split(',');
  }
  return field;
};

const parseArrayOrNumber = field => {
  if (!field) {
    return undefined;
  }
  if (typeof field === 'string') {
    return field
      .split(',')
      .map(Number)
      .sort();
  }
  return field.sort();
};

export const getSearchParams = searchParams => {
  return {
    // does not properly parse '+'.
    type: searchParams.type,
    tags: parseArrayOrString(searchParams.tags),
    lat: Number(searchParams.lat) || undefined,
    lng: Number(searchParams.lng) || undefined,
    adults: Number(searchParams.adults) || undefined,
    children: Number(searchParams.children) || undefined,
    infants: Number(searchParams.infants) || undefined,
    startDate: Number(searchParams.startDate) || undefined,
    endDate: Number(searchParams.endDate) || undefined,
    priceStart: Number(searchParams.priceStart) || undefined,
    priceEnd: Number(searchParams.priceEnd) || undefined,
    priceLevel: parseArrayOrNumber(searchParams.priceLevel),
    sortBy: searchParams.sortBy || undefined,
    address: searchParams.address || undefined,
    city: searchParams.city || undefined,
    state: searchParams.state || undefined,
    countryCode: searchParams.countryCode || undefined,
    text: searchParams.text || undefined,
    page: searchParams.page || 1,
    limit: searchParams.limit || 25,
  };
};

const paramsToSaveKeys = [
  'adults',
  'children',
  'infants',
  'city',
  'state',
  'countryCode',
  'lat',
  'lng',
  'address',
  'startDate',
  'endDate',
];

export const getParamsToSave = (searchParams, currentSavedParams) => {
  const paramsToSave = {
    ...currentSavedParams,
  };
  if (searchParams.city || searchParams.state || searchParams.countryCode) {
    delete paramsToSave.lat;
    delete paramsToSave.lng;
  }
  if (searchParams.lng && searchParams.lat) {
    delete paramsToSave.city;
    delete paramsToSave.state;
    delete paramsToSave.countryCode;
  }
  paramsToSaveKeys.forEach(param => {
    if (param in searchParams) {
      paramsToSave[param] = searchParams[param];
    }
  });
  return paramsToSave;
};

export const mapUrlToProps = location => {
  let searchParams = queryString.parse(location.search, { ignoreQueryPrefix: true });

  return getSearchParams(searchParams);
};

// If there is some processing required, just add the field here
// otherwise, the same object will be passed to the request
export const mapDataToQuery = ({ type, ...searchParams }) => ({
  address: undefined,
  category: type.charAt(0).toUpperCase() + type.substr(1),
  ...searchParams,
});

export const hasLocationParams = params => {
  return (params.lat && params.lng) || (params.city && params.countryCode);
};

const GUESTS = 'guests';
const DATES = 'dates';
const PRICE_RANGE = 'priceRange';
const PRICE_RANGE_ONLY_MAX = 'priceRangeOnlyMax';
const TAGS = 'tags';
const SINGLE_DATE = 'singleDate';
const PRICE_TAGS = 'priceTags';

export const availableFilters = {
  guests: GUESTS,
  dates: DATES,
  priceRange: PRICE_RANGE,
  priceRangeOnlyMax: PRICE_RANGE_ONLY_MAX,
  tags: TAGS,
  singleDate: SINGLE_DATE,
  priceTags: PRICE_TAGS,
};

export const filtersByType = {
  trip: [GUESTS, DATES, PRICE_RANGE, TAGS],
  accommodation: [GUESTS, DATES, PRICE_RANGE],
  activity: [GUESTS, SINGLE_DATE, PRICE_RANGE_ONLY_MAX, TAGS],
  food: [GUESTS, PRICE_TAGS, TAGS],
};

export const prefetchWithNewParams = (newParams, oldParams) => {
  if (isEqual(newParams, oldParams)) {
    return;
  }
  if ((newParams.city && newParams.countryCode) || (newParams.lat && newParams.lng)) {
    if (newParams.startDate) {
      const body = {
        adultCount: newParams.adults || 2,
        childrenCount: newParams.children || 0,
        infantCount: newParams.infants || 0,
        location: {
          ...(newParams.city
            ? {
                city: newParams.city,
                countryCode: newParams.countryCode,
              }
            : {
                lat: newParams.lat,
                lng: newParams.lng,
              }),
        },
        dates: [moment(newParams.startDate).format('YYYY-MM-DD')],
      };
      apiClient.services.search.prefetch(body);
    }
  }
};
