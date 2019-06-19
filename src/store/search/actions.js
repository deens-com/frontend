import fetchHelpers from 'libs/fetch_helpers';
import api from 'libs/apiClient';
import history from 'main/history';
import { createAsyncActions, dispatchAsyncActions } from 'store/utils';
import { parseTagsText, parseTagsCount } from 'libs/Utils';
import {
  mapDataToQuery,
  getSearchParams,
  getParamsToSave,
  prefetchWithNewParams,
} from 'libs/search';
import { removeMultiParams } from 'libs/location';
import { setLastSearchParams, getLastSearchParams } from 'libs/localStorage';
import { removeMultipleLocations } from 'libs/search';
import urls from 'libs/urlGenerator';

const SEARCH = 'SEARCH';
const UPDATE_QUERY_PARAMS = 'UPDATE_QUERY_PARAMS';
const PATCH_QUERY_PARAMS = 'PATCH_QUERY_PARAMS';

const types = {
  search: createAsyncActions(SEARCH),
  updateQueryParams: UPDATE_QUERY_PARAMS,
  patchQueryParams: PATCH_QUERY_PARAMS,
};

const patchSearchQuery = searchParams => ({
  type: PATCH_QUERY_PARAMS,
  payload: searchParams,
});

const fetchResults = searchQuery =>
  dispatchAsyncActions(SEARCH, async () => {
    const searchForTrips = searchQuery.type === 'trip';
    const params = {
      page: 1,
      limit: 25,
      ...mapDataToQuery(searchQuery),
      include: ['tags'],
      ...(searchForTrips ? { include: ['owner', 'tags'] } : {}),
    };

    const results = await (searchForTrips
      ? api.trips.search.get(params)
      : api.services.search.get(params));

    const resultsArr = searchForTrips ? results.data.trips : results.data.services;
    const data = fetchHelpers.buildServicesJson(resultsArr, false);

    const tags = parseTagsText(
      searchForTrips ? parseTagsCount(results.data.tagsWithCount) : results.data.tags,
    );

    return {
      results: data,
      count: results.data.count,
      extraData: results.data.extraData,
      maxPrice: results.data.maxPrice,
      minPrice: results.data.minPrice,
      tags,
    };
  });

const updateSearchParams = (searchParams, state, customPage, noPushUrl, noFetch) => (
  dispatch,
  getState,
) => {
  const savedParams = getLastSearchParams();
  const paramsToSave = getParamsToSave(searchParams, savedParams);
  const page = customPage || (searchParams.page ? 1 : undefined);
  let params = { ...paramsToSave, ...searchParams };
  if (!params.type) {
    params = { ...params, type: getState().search.searchQuery.type || 'trip' };
  }

  let reqParams = params;
  const { type: searchForType, ...urlParams } = getSearchParams({ ...params, page });

  reqParams = {
    ...reqParams,
    ...removeMultiParams(reqParams),
  };

  reqParams = removeMultipleLocations(getSearchParams({ ...reqParams, page }));

  if (!noFetch) {
    dispatch(fetchResults(reqParams));
  }

  if (!noPushUrl) {
    history.push(urls.search(searchForType, urlParams), state);
  }

  prefetchWithNewParams(paramsToSave, savedParams);
  setLastSearchParams(paramsToSave);
  dispatch({
    type: types.updateQueryParams,
    payload: {
      type: searchForType,
      ...urlParams,
    },
  });
};

export default {
  types,
  fetchResults,
  updateSearchParams,
  patchSearchQuery,
};
