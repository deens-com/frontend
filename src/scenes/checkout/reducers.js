import { types, tripBookingStatuses } from './actions';

export default (state, action = {}) => {
  switch (action.type) {
    case types.MARK_TRIP_BOOKED_STARTED: {
      return {
        ...state,
        bookingStatus: tripBookingStatuses.STARTED,
      };
    }
    case types.MARK_TRIP_BOOKED_SUCCESS: {
      return {
        ...state,
        bookingStatus: tripBookingStatuses.SUCCESS,
      };
    }
    case types.MARK_TRIP_BOOKED_ERROR: {
      return {
        ...state,
        bookingStatus: tripBookingStatuses.ERROR,
      };
    }
    default:
      return state;
  }
};
