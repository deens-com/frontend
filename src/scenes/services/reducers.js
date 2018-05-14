const initialState = {
  service: {},
  trips: [],
  userTrips: {
    isLoading: false,
    data: [],
  },
  reviews: [],
  serviceRecentlyAddedToTripName: null,
};

export default function ServicesReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'SERVICE_FETCHED':
      return {
        ...state,
        service: action.payload.service,
      };
    case 'TRIPS_FETCHED':
      return {
        ...state,
        trips: action.payload.trips,
      };
    case 'REVIEWS_FETCHED':
      return {
        ...state,
        reviews: action.payload.reviews,
      };
    case 'USER_TRIPS_FETCH':
      return {
        ...state,
        userTrips: { ...state.userTrips, isLoading: true },
      };
    case 'USER_TRIPS_FETCH_FINISH':
      return {
        ...state,
        userTrips: { isLoading: false, data: action.payload },
      };
    case 'SERVICE_RECENTLY_ADDED_TO_TRIP':
      return {
        ...state,
        serviceRecentlyAddedToTripName: action.payload,
      };
    default:
      return state;
  }
}
