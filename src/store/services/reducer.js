const initialState = {
  isPageLoading: false,
  service: {},
  trips: [],
  userUnpurchasedTrips: {
    isLoading: false,
    data: [],
  },
  ratings: [],
  reviews: [],
  serviceRecentlyAddedToTrip: null,
  serviceAlreadyAddedToTrip: null,
  isServiceUnavailableModalOpen: false,
  abi: null,
  bytecode: null,
  serviceFetchError: {},
};

export default function services(state = initialState, action = {}) {
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
    case 'TRIP_CREATING':
      return {
        ...state,
        isCreatingTrip: true,
      };
    case 'TRIP_CREATED':
      return {
        ...state,
        trips: [...state.trips, action.payload.trip],
        isCreatingTrip: false,
      };
    case 'SERVICE_FETCH_ERROR':
      return {
        ...state,
        isPageLoading: false,
        serviceFetchError: action.payload,
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
    case 'TRIP_UPDATING':
      return {
        ...state,
        isUpdatingTrip: true,
      };
    case 'SERVICE_RECENTLY_ADDED_TO_TRIP':
      return {
        ...state,
        serviceRecentlyAddedToTrip: action.payload,
        serviceAlreadyAddedToTrip: undefined,
        isUpdatingTrip: false,
      };
    case 'SERVICE_ALREADY_ADDED_TO_TRIP':
      return {
        ...state,
        serviceAlreadyAddedToTrip: action.payload,
        serviceRecentlyAddedToTrip: undefined,
        isUpdatingTrip: false,
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
