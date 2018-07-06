const initialState = {
  isPageLoading: false,
  service: {},
  trips: [],
  userUnpurchasedTrips: {
    isLoading: false,
    data: [],
  },
  reviews: [],
  serviceRecentlyAddedToTrip: null,
  serviceAlreadyAddedToTrip: null,
  isServiceUnavailableModalOpen: false,
  abi: null,
  bytecode: null,
};

export default function ServicesReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'SERVICE_FETCH_START':
      return {
        ...state,
        isPageLoading: true,
      };
    case 'SERVICE_FETCHED':
      return {
        ...state,
        isPageLoading: false,
        service: action.payload.service,
      };
    case 'SERVICE_FETCH_ERROR':
      return {
        ...state,
        isPageLoading: false,
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
    case 'USER_UNPURCHASED_TRIPS_FETCH':
      return {
        ...state,
        userUnpurchasedTrips: { ...state.userUnpurchasedTrips, isLoading: true },
      };
    case 'USER_UNPURCHASED_TRIPS_FETCH_FINISH':
      return {
        ...state,
        userUnpurchasedTrips: { isLoading: false, data: action.payload },
      };
    case 'SERVICE_RECENTLY_ADDED_TO_TRIP':
      return {
        ...state,
        serviceRecentlyAddedToTrip: action.payload,
        serviceAlreadyAddedToTrip: undefined,
      };
    case 'SERVICE_ALREADY_ADDED_TO_TRIP':
      return {
        ...state,
        serviceAlreadyAddedToTrip: action.payload,
        serviceRecentlyAddedToTrip: undefined,
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
    case 'SERVICE/RESET':
      return initialState;
    default:
      return state;
  }
}
