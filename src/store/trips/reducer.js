import actions from './actions';

const { types } = actions;

const initialState = {
  userTrips: {
    isLoading: false,
    trips: null,
    unbookedTrips: null,
    error: null,
  },
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
    default:
      return state;
  }
}
