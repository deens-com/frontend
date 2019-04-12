const composeQuery = search_params => {
  const query_params = {
    type: !search_params.type.length ? undefined : search_params.type.join('+'),
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
    city: search_params.city || undefined,
    state: search_params.state || undefined,
    countryCode: search_params.countryCode || undefined,
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

export const updatePath = (search_params, history, state) => {
  const query_string = composeQuery(search_params);
  history.push('/results?' + query_string, state);
  // will trigger update_search_query from results_container
};
