const initialState = {
  service: {},
  trips: [],
  userTrips: {
    isLoading: false,
    data: [],
  },
  reviews: [],
  serviceRecentlyAddedToTrip: null,
  isServiceUnavailableModalOpen: false,
  abi: null,
  bytecode: null,
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
        serviceRecentlyAddedToTrip: action.payload,
      };
    case 'SERVICE_UNAVAILABILITY_MODAL_SET':
      return {
        ...state,
        isServiceUnavailableModalOpen: action.payload,
      };
    case 'SERVICE_CONTRACT_ABI':
      return {
        ...state,
        ...action.payload,
        abi: JSON.stringify(action.payload.abi),
      };
    default:
      return state;
  }
}
