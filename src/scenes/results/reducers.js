const initialState = {
  results: []
};

export default function ResultsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "RESULTS_FETCHED":
      return {
        ...state,
        results: action.payload.results
      };
    default:
      return state;
  }
}
