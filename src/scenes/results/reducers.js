const initialState = {
  results: [],
  search_query: {
    type: "",
    tags: []
  }
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
    default:
      return state;
  }
}
