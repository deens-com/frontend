import fetchHelpers from 'libs/fetch_helpers';
import api from 'libs/apiClient';
import { createAsyncActions, dispatchAsyncActions } from 'store/utils';
import { parseTagsText } from 'libs/Utils';

const SEARCH = 'SEARCH';
const UPDATE_QUERY_PARAMS = 'UPDATE_QUERY_PARAMS';

const types = {
  search: createAsyncActions(SEARCH),
  updateQueryParams: UPDATE_QUERY_PARAMS,
};

const updateSearchQuery = searchParams => ({
  type: UPDATE_QUERY_PARAMS,
  payload: searchParams,
});

const composeSearchParams = searchParams => ({
  category: !searchParams.type.length
    ? undefined
    : searchParams.type.map(a => a.charAt(0).toUpperCase() + a.substr(1)).join('+'),
  startDate: searchParams.start_date || undefined,
  endDate: searchParams.end_date || undefined,
  adults: Number(searchParams.adults) || undefined,
  children: Number(searchParams.children) || undefined,
  infants: Number(searchParams.infants) || undefined,
  lat: searchParams.latitude || undefined,
  lng: searchParams.longitude || undefined,
  address: searchParams.address || undefined,
  tags: !searchParams.tags.length ? undefined : searchParams.tags.join(','),
  onlySmartContracts: searchParams.onlySmartContracts || undefined,
  page: searchParams.page || 1,
  limit: searchParams.limit || 1,
  text: searchParams.text || undefined,
  sortBy: searchParams.sortBy || undefined,
  radiusInKm: searchParams.radiusInKm || 10,
  city: searchParams.city || undefined,
  state: searchParams.state || undefined,
  countryCode: searchParams.countryCode || undefined,
});

const fetchResults = searchQuery =>
  dispatchAsyncActions(SEARCH, async () => {
    const searchForTrips = searchQuery.type.includes('trip');
    const params = {
      ...composeSearchParams(searchQuery),
      ...(searchForTrips ? { include: 'owner' } : {}),
    };
    const results = await (searchForTrips
      ? api.trips.search.get(params)
      : api.services.search.get(params));

    const resultsArr = searchForTrips ? results.data.trips : results.data.services;
    const data = fetchHelpers.buildServicesJson(resultsArr);

    const tags = parseTagsText(results.data.tags);

    return {
      results: data,
      count: results.data.count,
      tags,
    };
  });

/*const searchTrips = (includes = []) => {
  return dispatchAsyncActions(
    SEARCH_TRIPS,
    async () =>
      (,
  );
};*/

export default {
  types,
  fetchResults,
  updateSearchQuery,
};
