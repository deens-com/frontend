import actions from './actions';

const { types } = actions;

const initialState = {
  userTrips: {
    isLoading: false,
    trips: null,
    unbookedTrips: null,
    error: null,
  },
  trip: null,
  isLoading: false,
  error: null,
  owner: null,
  availability: {
    data: null,
    isChecking: false,
    timestamp: null, // To check for race conditions
    error: null,
  },
  isCloning: false,
  bookingStatus: null,
};

export default function services(state = initialState, action = {}) {
  switch (action.type) {
    case types.FETCH_USER_TRIPS_START:
      return {
        ...state,
        userTrips: {
          isLoading: true,
          trips: null,
          unbookedTrips: null,
          error: null,
        },
      };
    case types.FETCH_USER_TRIPS_SUCCESS:
      return {
        ...state,
        userTrips: {
          isLoading: false,
          trips: action.payload,
          unbookedTrips: action.payload.filter(trip => trip.bookingStatus !== 'booked'),
        },
      };
    case types.FETCH_USER_TRIPS_ERROR:
      return {
        ...state,
        userTrips: {
          isLoading: false,
          trips: null,
          unbookedTrips: null,
          error: action.payload,
        },
      };
    case types.FETCH_TRIP_START: {
      return {
        ...state,
        isLoading: true,
        error: null,
        trip: null,
      };
    }
    case types.FETCH_TRIP_SUCCESS: {
      return {
        ...state,
        trip: action.payload,
        isLoading: false,
        error: null,
      };
    }
    case types.FETCH_TRIP_ERROR: {
      return {
        ...state,
        trip: null,
        isLoading: false,
        error: action.payload,
      };
    }
    case types.CLONE_TRIP_START: {
      return {
        ...state,
        isCloning: true,
      };
    }
    case types.CLONE_TRIP_SUCCESS: {
      return {
        ...state,
        isCloning: false,
      };
    }
    case types.CLONE_TRIP_ERROR: {
      return {
        ...state,
        isCloning: false,
      };
    }
    case types.FETCH_OWNER_START: {
      return {
        ...state,
        owner: null,
      };
    }
    case types.FETCH_OWNER_SUCCESS: {
      return {
        ...state,
        owner: action.payload,
      };
    }
    case types.CHECK_AVAILABILITY_START: {
      return {
        ...state,
        availability: {
          ...initialState.availability,
          isChecking: true,
          timestamp: action.timestamp,
        },
      };
    }
    case types.CHECK_AVAILABILITY_SUCCESS: {
      if (action.timestamp !== state.availability.timestamp) {
        return state;
      }

      return {
        ...state,
        availability: {
          ...state.availability,
          isChecking: false,
          data: action.payload.data,
        },
      };
    }
    case types.CHECK_AVAILABILITY_ERROR: {
      if (action.timestamp !== state.availability.timestamp) {
        return state;
      }

      return {
        ...state,
        availability: {
          ...initialState.availability,
          error: action.payload,
          timestamp: action.timestamp,
        },
      };
    }

    case types.RESET_TRIP: {
      return initialState;
    }
    default:
      return state;
  }
}
