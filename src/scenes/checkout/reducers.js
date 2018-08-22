import { types } from './actions';

export default (state, action = {}) => {
  switch (action.type) {
    case types.MARK_TRIP_BOOKED_STATUS: {
      return {
        ...state,
        bookingStatus: action.payload,
        paymentError: undefined,
      };
    }
    case types.PAYMENT_ERROR: {
      return {
        ...state,
        paymentError: action.payload,
      };
    }
    default:
      return state;
  }
};
