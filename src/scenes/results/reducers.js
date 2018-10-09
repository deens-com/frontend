const initialState = {
  results: [],
  search_query: {
    service_types: [],
    tags: [],
    resultsCount: 0,
    page: 0,
    sortBy: '',
  },
  carousel_tags: [],
  isLoadingResults: false,
  tagsOptions: [],
};

export default function ResultsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'RESULTS_FETCHED':
      return {
        ...state,
        results: action.payload.results,
        isLoadingResults: false,
      };
    case 'SEARCH_QUERY_UPDATED':
      return {
        ...state,
        search_query: {
          ...state.search_query,
          ...action.payload.search_query,
        },
      };
    case 'CAROUSEL_TAGS_FETCHED':
      return {
        ...state,
        carousel_tags: action.payload,
      };
    case 'RESULTS_FETCH_STARTED':
      return {
        ...state,
        isLoadingResults: true,
      };
    case 'TAGS_FETCHED':
      return {
        ...state,
        tagsOptions: action.payload,
      };
    default:
      return state;
  }
}
