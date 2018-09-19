const initialState = {
  trips: [],
  isLoadingTrips: false,
};

export default function homeReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'TRIPS_FETCH_STARTED':
      return {
        ...state,
        isLoadingTrips: true,
        trips: [],
      };
    case 'TRIPS_FETCH_SUCCESS':
      return {
        ...state,
        isLoadingTrips: false,
        trips: action.payload,
      };
    case 'TRIPS_FETCH_ERROR':
      return {
        ...state,
        isLoadingTrips: false,
        trips: [],
      };
    default:
      return state;
  }
}
