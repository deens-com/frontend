import queryString from 'query-string';
import apiClient from 'libs/apiClient';
import { isEqual } from 'lodash';
import { formatYYYYMMDD, isSearchPage } from 'libs/Utils';

export function getAddress(params) {
  if (params.text && (params.type === 'trip' || !params.type)) {
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

export const selectLocationSearchType = params => {
  if (params.locationSearchType) {
    return params.locationSearchType;
  }
  if (usingLatAndLng(params)) {
    return 'latlng';
  }
  if (usingBoundingBox(params)) {
    return 'bounds';
  }
  if (usingCountryCode(params)) {
    return 'placeData';
  }
  return undefined;
};

export const getSearchParams = params => {
  const locationSearchType = selectLocationSearchType(params);
  let searchParams = params;
  if (locationSearchType === 'bounds') {
    const { lat, lng, city, state, countryCode, ...restParams } = params;
    searchParams = restParams;
  }
  return {
    // does not properly parse '+'.
    type: searchParams.type,
    tags: parseArrayOrString(searchParams.tags),
    lat: Number(searchParams.lat) || undefined,
    lng: Number(searchParams.lng) || undefined,
    topRightLat: Number(searchParams.topRightLat) || undefined,
    topRightLng: Number(searchParams.topRightLng) || undefined,
    bottomLeftLat: Number(searchParams.bottomLeftLat) || undefined,
    bottomLeftLng: Number(searchParams.bottomLeftLng) || undefined,
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
    duration: Number(searchParams.duration) || undefined,
    ratingStart: Number(searchParams.ratingStart) || undefined,
    ratingEnd: Number(searchParams.ratingEnd) || undefined,
    page: searchParams.page || 1,
    limit: searchParams.limit || 25,
    locationSearchType,
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
  'locationSearchType',
];

export const getParamsToSave = (searchParams, currentSavedParams) => {
  const paramsToSave = {
    ...currentSavedParams,
  };
  if (usingLatAndLng(searchParams) || usingCountryCode(searchParams)) {
    delete paramsToSave.lat;
    delete paramsToSave.lng;
    delete paramsToSave.city;
    delete paramsToSave.state;
    delete paramsToSave.countryCode;
  }
  const now = Date.now();
  if (
    (paramsToSave.startDate && now >= paramsToSave.startDate) ||
    (paramsToSave.endDate && now >= paramsToSave.endDate)
  ) {
    // startDate or endDate is in the past
    delete paramsToSave.startDate;
    delete paramsToSave.endDate;
  }

  paramsToSaveKeys.forEach(param => {
    if (param in searchParams) {
      if (param === 'locationSearchType' && searchParams[param] === 'bounds') {
        return;
      }
      paramsToSave[param] = searchParams[param];
    }
  });
  return paramsToSave;
};

export const mapUrlToProps = location => {
  if (!isSearchPage(location.pathname)) {
    return {};
  }

  const searchParams = queryString.parse(location.search);
  return getSearchParams({
    ...searchParams,
    type: location.pathname.substring(location.pathname.lastIndexOf('/') + 1),
  });
};

// If there is some processing required, just add the field here
// otherwise, the same object will be passed to the request
export const mapDataToQuery = ({ type, duration, ...searchParams }) => ({
  address: undefined,
  category: type.charAt(0).toUpperCase() + type.substr(1),
  activityDurationSlab: duration,
  ...searchParams,
});

export const usingLatAndLng = params => Boolean(params.lat && params.lng);
export const usingCountryCode = params => Boolean(params.countryCode);
export const usingBoundingBox = params =>
  Boolean(params.topRightLat && params.topRightLng && params.bottomLeftLat && params.bottomLeftLng);

export const hasLocationParams = params => {
  return usingLatAndLng(params) || usingCountryCode(params) || usingBoundingBox(params);
};

export const hasMultipleLocationParams = params => {
  const numberOfLocations = [
    usingLatAndLng(params),
    usingCountryCode(params),
    usingBoundingBox(params),
  ].reduce((num, elem) => num + (elem ? 1 : 0), 0);
  return numberOfLocations > 1;
};

export const removeMultipleLocations = params => {
  if (hasMultipleLocationParams(params)) {
    if (usingLatAndLng(params)) {
      return removeMultipleLocations({
        ...params,
        lat: undefined,
        lng: undefined,
      });
    }
    if (usingCountryCode(params)) {
      return removeMultipleLocations({
        ...params,
        city: undefined,
        state: undefined,
        countryCode: undefined,
      });
    }
  }
  return params;
};

export const getLocationParams = params => ({
  city: params.city,
  state: params.state,
  countryCode: params.countryCode,
  lat: params.lat,
  lng: params.lng,
});

const GUESTS = 'guests';
const DATES = 'dates';
const PRICE_RANGE = 'priceRange';
const PRICE_RANGE_ONLY_MAX = 'priceRangeOnlyMax';
const TAGS = 'tags';
const SINGLE_DATE = 'singleDate';
const PRICE_TAGS = 'priceTags';
const TEXT = 'text';
const DURATION = 'duration';
const RATING = 'rating';

export const availableFilters = {
  guests: GUESTS,
  dates: DATES,
  priceRange: PRICE_RANGE,
  priceRangeOnlyMax: PRICE_RANGE_ONLY_MAX,
  tags: TAGS,
  singleDate: SINGLE_DATE,
  priceTags: PRICE_TAGS,
  text: TEXT,
  duration: DURATION,
  rating: RATING,
};

export const filtersByType = {
  trip: [GUESTS, DATES, PRICE_RANGE, TAGS],
  accommodation: [GUESTS, DATES, PRICE_RANGE, TEXT, RATING],
  activity: [GUESTS, SINGLE_DATE, PRICE_RANGE_ONLY_MAX, TAGS, TEXT, DURATION],
  food: [GUESTS, PRICE_TAGS, TAGS, TEXT],
};

export const prefetchWithNewParams = (newParams, oldParams) => {
  if (isEqual(newParams, oldParams)) {
    return;
  }
  if ((newParams.city && newParams.countryCode) || (newParams.lat && newParams.lng)) {
    if (newParams.startDate) {
      const { lat, lng } = getLocationParams(newParams);
      const body = {
        adultCount: newParams.adults || 2,
        childrenCount: newParams.children || 0,
        infantCount: newParams.infants || 0,
        location: {
          lat,
          lng,
        },
        dates: [formatYYYYMMDD(newParams.startDate)],
      };
      apiClient.services.search.prefetch(body);
    }
  }
};
