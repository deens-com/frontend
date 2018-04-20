const initialState = {
  results: [],
  search_query: {
    service_types: [],
    tags: []
  },
  carousel_tags: []
};

export default function ResultsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "RESULTS_FETCHED":
      return {
        ...state,
        results: action.payload.results
      };
    case "SEARCH_QUERY_UPDATED":
      return {
        ...state,
        search_query: action.payload.search_query
      };
    case "CAROUSEL_TAGS_FETCHED":
      return {
        ...state,
        carousel_tags: action.payload
      }
    default:
      return state;
  }
}
