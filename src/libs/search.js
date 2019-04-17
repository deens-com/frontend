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

export const mapUrlToProps = location => {
  let searchParams = queryString.parse(location.search, { ignoreQueryPrefix: true });

  return {
    // does not properly parse '+'.
    type: (searchParams.type && searchParams.type.split(',')) || [],
    tags: searchParams.tags ? searchParams.tags.split(',') : [],
    lat: Number(searchParams.lat) || undefined,
    lng: Number(searchParams.lng) || undefined,
    adults: Number(searchParams.adults) || undefined,
    children: Number(searchParams.children) || undefined,
    infants: Number(searchParams.infants) || undefined,
    start_date: Number(searchParams.start_date) || undefined,
    end_date: Number(searchParams.end_date) || undefined,
    priceStart: Number(searchParams.priceStart) || undefined,
    priceEnd: Number(searchParams.priceEnd) || undefined,
    priceLevel:
      (searchParams.priceLevel &&
        searchParams.priceLevel
          .split(',')
          .map(Number)
          .sort()) ||
      undefined,
    keywords: searchParams.keywords,
    sortBy: searchParams.sortBy,
    address: searchParams.address || undefined,
    city: searchParams.city,
    state: searchParams.state,
    countryCode: searchParams.countryCode,
    text: searchParams.text,
    page: searchParams.page || 1,
    limit: searchParams.limit || 10,
  };
};

// If there is some processing required, just add the field here
// otherwise, the same object will be passed to the request
export const mapDataToQuery = ({ type, ...searchParams }) => ({
  address: undefined,
  category: !type.length
    ? undefined
    : type.map(a => a.charAt(0).toUpperCase() + a.substr(1)).join('+'),
  ...searchParams,
});

export const pushSearch = (searchParams, state) => {
  history.push(`/results?${queryString.stringify(searchParams, { arrayFormat: 'comma' })}`, state);
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
  accommodation: [GUESTS, DATES, PRICE_RANGE, TAGS],
  activity: [GUESTS, SINGLE_DATE, PRICE_RANGE, TAGS],
  food: [GUESTS, SINGLE_DATE, PRICE_TAGS, TAGS],
};
