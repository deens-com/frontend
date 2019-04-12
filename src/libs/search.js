import queryString from 'qs';
import history from 'main/history';

export function getAddress(params) {
  if (params.text) {
    return params.text;
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
    type: (searchParams.type && searchParams.type.split(' ')) || [],
    tags:
      (location.search.match(/(tags.+)/) &&
        location.search
          .match(/(tags.+)/)[0]
          .split('&')[0]
          .replace('tags=', '')
          .split('+')) ||
      [],
    lat: searchParams.lat,
    lng: searchParams.lng,
    adults: Number(searchParams.adults) || undefined,
    children: Number(searchParams.children) || undefined,
    infants: Number(searchParams.infants) || undefined,
    start_date: searchParams.start_date,
    end_date: searchParams.end_date,
    keywords: searchParams.keywords,
    sortBy: searchParams.sortBy,
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
  category: !type.length
    ? undefined
    : type.map(a => a.charAt(0).toUpperCase() + a.substr(1)).join('+'),
  ...searchParams,
});

export const pushSearch = searchParams => {
  history.push(`/results?${queryString.stringify(searchParams, { arrayFormat: 'comma' })}`);
};

export const filtersByType = {
  trip: ['guests', 'dates', 'priceRange', 'tags'],
  accommodation: ['guests', 'dates', 'priceRange', 'tags'],
  activity: ['guests', 'singleDate', 'priceRange', 'tags'],
  food: ['guests', 'singleDate', 'priceTags', 'tags'],
};
