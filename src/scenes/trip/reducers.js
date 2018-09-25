import { types } from './actions';

const initialState = {
  trip: null,
  isLoading: false,
  error: null,
  owner: null,
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
    default:
      return state;
  }
}
