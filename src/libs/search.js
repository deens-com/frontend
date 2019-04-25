import queryString from 'qs';
import history from 'main/history';

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

const getSearchParams = searchParams => {
  return {
    // does not properly parse '+'.
    type: searchParams.type,
    tags: searchParams.tags ? searchParams.tags.split(',') : undefined,
    lat: Number(searchParams.lat) || undefined,
    lng: Number(searchParams.lng) || undefined,
    adults: Number(searchParams.adults) || undefined,
    children: Number(searchParams.children) || undefined,
    infants: Number(searchParams.infants) || undefined,
    startDate: Number(searchParams.startDate) || undefined,
    endDate: Number(searchParams.endDate) || undefined,
    priceStart: Number(searchParams.priceStart) || undefined,
    priceEnd: Number(searchParams.priceEnd) || undefined,
    priceLevel:
      (searchParams.priceLevel &&
        searchParams.priceLevel
          .split(',')
          .map(Number)
          .sort()) ||
      undefined,
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

export const pushSearch = (searchParams, state, customPage) => {
  const page = customPage || (searchParams.page ? 1 : undefined);
  const params = getSearchParams({ ...searchParams, page });
  history.push(`/results?${queryString.stringify(params, { arrayFormat: 'comma' })}`, state);
};

export const hasLocationParams = params => {
  return (params.lat && params.lng) || (params.city && params.countryCode);
};

const GUESTS = 'guests';
const DATES = 'dates';
const PRICE_RANGE = 'priceRange';
const TAGS = 'tags';
const SINGLE_DATE = 'singleDate';
const PRICE_TAGS = 'priceTags';

export const availableFilters = {
  guests: GUESTS,
  dates: DATES,
  priceRange: PRICE_RANGE,
  tags: TAGS,
  singleDate: SINGLE_DATE,
  priceTags: PRICE_TAGS,
};

export const filtersByType = {
  trip: [GUESTS, DATES, PRICE_RANGE, TAGS],
  accommodation: [GUESTS, DATES, PRICE_RANGE],
  activity: [GUESTS, SINGLE_DATE, PRICE_RANGE, TAGS],
  food: [GUESTS, PRICE_TAGS, TAGS],
};
