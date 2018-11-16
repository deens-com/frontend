import axios from 'libs/axios';
import fetch_helpers from 'libs/fetch_helpers';
import { trackVoiceUsage } from 'libs/analytics';
// import history from 'main/history';

export const results_fetched = (results, timestamp) => {
  return {
    type: 'RESULTS_FETCHED',
    payload: results,
    timestamp,
  };
};

export const tagsOptionsFetched = tags => {
  return {
    type: 'TAGS_FETCHED',
    payload: tags,
  };
};

export const results_fetch_started = timestamp => {
  return {
    type: 'RESULTS_FETCH_STARTED',
    timestamp,
  };
};

export const search_query_updated = (search_query, timestamp) => {
  return {
    type: 'SEARCH_QUERY_UPDATED',
    payload: search_query,
    timestamp,
  };
};

export const toggle_tag_from_search_query = (current_search_query, item_tag, history) => {
  return dispatch => {
    let search_params = current_search_query;
    if (current_search_query.tags.length) {
      // if tags present in url
      let selected_tags_array = current_search_query.tags.splice('+');
      // eslint-disable-next-line
      let tags_str = '';
      if (selected_tags_array.includes(item_tag)) {
        // if tag already present, remove it
        let new_arr = selected_tags_array.filter(tag => tag !== item_tag);
        selected_tags_array = new_arr;
        tags_str = new_arr.join('+');
      } else {
        // if tag was not present, add it
        selected_tags_array.push(item_tag);
        tags_str = selected_tags_array.join('+');
      }
      search_params.tags = selected_tags_array;
    } else {
      // If No tags yet
      if (item_tag) {
        search_params.tags.push(item_tag);
      }
    }
    dispatch(update_path(search_params, history));
    // will trigger update_search_query from results_container
  };
};

export const update_path = (search_params, history, state) => {
  // I don't know why this is an action creator but don't have time to refactor ATM
  return dispatch => {
    const query_string = composeQuery(search_params);
    history.push('/results?' + query_string, state);
    // will trigger update_search_query from results_container
  };
};

const composeQuery = search_params => {
  const query_params = {
    serviceTypes: !search_params.type.length ? undefined : search_params.type.join('+'),
    start_date: search_params.start_date || undefined,
    end_date: search_params.end_date || undefined,
    adults: Number(search_params.adults) || undefined,
    children: Number(search_params.children) || undefined,
    infants: Number(search_params.infants) || undefined,
    latitude: search_params.latitude || undefined,
    longitude: search_params.longitude || undefined,
    address: search_params.address || undefined,
    tags: !(search_params.tags && search_params.tags.length)
      ? undefined
      : search_params.tags.join('+'),
    onlySmartContracts: search_params.onlySmartContracts || undefined,
    page: search_params.page || 1,
    limit: search_params.limit || 10,
    sortBy: search_params.sortBy || undefined,
    text: typeof search_params.text === 'string' ? search_params.text : undefined,
    radiusInKm: search_params.radiusInKm || 10,
  };
  let query_arr = [];
  Object.entries(query_params).forEach(([key, value]) => {
    if (value) {
      let to_concat = key + '=' + value;
      query_arr = query_arr.concat(to_concat);
    }
  });
  const query_string = query_arr.join('&');
  return query_string;
};

export const composeFetchQuery = search_params => {
  const query_params = {
    category: !search_params.type.length
      ? undefined
      : search_params.type.map(a => a.charAt(0).toUpperCase() + a.substr(1)).join('+'),
    startDate: search_params.start_date || undefined,
    endDate: search_params.end_date || undefined,
    adults: Number(search_params.adults) || undefined,
    children: Number(search_params.children) || undefined,
    infants: Number(search_params.infants) || undefined,
    lat: search_params.latitude || undefined,
    lng: search_params.longitude || undefined,
    address: search_params.address || undefined,
    tags: !search_params.tags.length ? undefined : search_params.tags.join(','),
    onlySmartContracts: search_params.onlySmartContracts || undefined,
    page: search_params.page || 1,
    limit: search_params.limit || 1,
    text: search_params.text || undefined,
    sortBy: search_params.sortBy || undefined,
    radiusInKm: search_params.radiusInKm || 10,
  };
  let query_arr = [];
  Object.entries(query_params).forEach(([key, value]) => {
    if (value) {
      let to_concat = key + '=' + value;
      query_arr = query_arr.concat(to_concat);
    }
  });
  const query_string = query_arr.join('&');
  return query_string;
};

/* called from componentWillUpdate of results_container */
/* is triggered whenever serviceTypes or tags props have changed */
export const update_search_query = search_params => {
  return dispatch => {
    const timestamp = new Date().valueOf();
    dispatch(search_query_updated({ search_query: search_params }));
    dispatch(fetch_results(search_params, timestamp));
    dispatch(results_fetch_started(timestamp));
  };
};

export const update_search_query_without_search = search_params => {
  return dispatch => {
    dispatch(
      search_query_updated({
        search_query: search_params,
      }),
    );
  };
};

export const fetch_results = (results_search_query, timestamp) => {
  return async dispatch => {
    try {
      const query = composeFetchQuery(results_search_query);
      const includeTrips = results_search_query.type.includes('trip');
      const searchPath = `?${query ? query + '&' : ''}${includeTrips ? 'include=owner' : ''}`;
      const pathPrefix = includeTrips ? '/search' : '/search/services';
      const results = await axios.get(pathPrefix + searchPath);
      if (results) {
        const resultsArr = results.data.trips || results.data.services;
        const data = fetch_helpers.buildServicesJson(resultsArr);
        const resultsData = { results: data };
        dispatch(results_fetched(resultsData, timestamp));
        results_search_query['resultsCount'] = results.data.count;
        dispatch(search_query_updated({ search_query: results_search_query }, timestamp));
        const tagsOptions = results.data.tags.map(tag => {
          return tag.names['en-us'].charAt(0).toUpperCase() + tag.names['en-us'].substr(1);
        });
        const tags = tagsOptions.map(item => {
          return { text: item, value: item };
        });
        dispatch(tagsOptionsFetched(tags));
      }
    } catch (e) {
      console.log(e);
    }
  };
};

export const fetchTagsOptions = () => {
  return async dispatch => {
    try {
      const tags = await axios.get('/tags');
      if (tags) {
        const tagsOptions = tags.data.map(tag => {
          return tag.names['en-us'].charAt(0).toUpperCase() + tag.names['en-us'].substr(1);
        });
        const uniqTagItems = [...new Set(tagsOptions)];
        const uniqTagsOptions = uniqTagItems.map(item => {
          return { text: item, value: item };
        });
        dispatch(tagsOptionsFetched(uniqTagsOptions));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const voiceQuery = results => dispatch => {
  dispatch({ type: 'analytics', meta: { analytics: trackVoiceUsage(results) } });
};
