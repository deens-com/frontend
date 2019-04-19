import fetchHelpers from 'libs/fetch_helpers';
import api from 'libs/apiClient';
import { createAsyncActions, dispatchAsyncActions } from 'store/utils';
import { parseTagsText, tagsById } from 'libs/Utils';
import { mapDataToQuery } from 'libs/search';

const SEARCH = 'SEARCH';
const UPDATE_QUERY_PARAMS = 'UPDATE_QUERY_PARAMS';
const PATCH_QUERY_PARAMS = 'PATCH_QUERY_PARAMS';

const types = {
  search: createAsyncActions(SEARCH),
  updateQueryParams: UPDATE_QUERY_PARAMS,
  patchQueryParams: PATCH_QUERY_PARAMS,
};

const updateSearchQuery = searchParams => ({
  type: UPDATE_QUERY_PARAMS,
  payload: searchParams,
});

const patchSearchQuery = searchParams => ({
  type: PATCH_QUERY_PARAMS,
  payload: searchParams,
});

const fetchResults = searchQuery =>
  dispatchAsyncActions(SEARCH, async () => {
    const searchForTrips = searchQuery.type.includes('trip');
    const params = {
      page: 1,
      limit: 10,
      ...mapDataToQuery(searchQuery),
      include: ['tags'],
      ...(searchForTrips ? { include: ['owner', 'tags'] } : {}),
    };

    if (!searchForTrips) {
      if (
        params.text || // next we check that we have any kind of location
        (!(params.lat && params.lng) && !(params.city && params.countryCode))
      ) {
        return {
          results: [],
          count: 0,
          tags: [],
        };
      }
    }
    const results = await (searchForTrips
      ? api.trips.search.get(params)
      : api.services.search.get(params));

    const resultsArr = searchForTrips ? results.data.trips : results.data.services;
    const data = fetchHelpers.buildServicesJson(resultsArr, false);

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
  patchSearchQuery,
};
