import { types } from './actions';

const getErrorMessageFromStripeCode = code => {
  switch (code) {
    case 'expired_card':
      return 'Your card has been expired. Please try another card';
    case 'card_declined':
      return 'Your card has been declined. Please try another card';
    case 'incorrect_cvc':
      return 'Incorrect CVC code. Please check your card';
    case 'insufficient_funds':
      return 'Insufficient funds. Please try another card';
    case 'processing_error':
      return 'Processing error has occurred. Please try again';
    default:
      return undefined;
  }
};

const initialState = {
  bookingStatus: null,
  paymentError: null,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.CLEAN_PAYMENT_STATUS: {
      return initialState;
    }
    case types.MARK_TRIP_BOOKED_STATUS: {
      return {
        ...state,
        bookingStatus: action.payload,
        paymentError: null,
      };
    }
    case types.PAYMENT_ERROR: {
      action.payload.customMessage =
        getErrorMessageFromStripeCode(action.payload.code) || action.payload.message;
      return {
        ...state,
        paymentError: action.payload,
        bookingStatus: null,
      };
    }
    default:
      return state;
  }
};
