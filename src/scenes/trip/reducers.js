import { types } from './actions';

const initialState = {
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
};

export default function TripsReducer(state = initialState, action = {}) {
  switch (action.type) {
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
          data: action.payload.data.reduce((prev, service) => {
            return {
              ...prev,
              [service.serviceId]: service.isAvailable,
            };
          }, {}),
          isChecking: false,
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
        },
      };
    }
    default:
      return state;
  }
}
