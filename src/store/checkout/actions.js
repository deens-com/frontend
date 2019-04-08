import axios from 'libs/axios';
import fetch_helpers from 'libs/fetch_helpers';

export const types = {
  MARK_TRIP_BOOKED_STATUS: 'MARK_TRIP_BOOKED_STATUS',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  CLEAN_PAYMENT_STATUS: 'CLEAN_PAYMENT_STATUS',
};

const { statuses } = fetch_helpers;

export const cleanPaymentStatus = () => dispatch => {
  dispatch({
    type: types.CLEAN_PAYMENT_STATUS,
  });
};

export const chargeStripeToken = (token, guests, complete = () => {}) => async (
  dispatch,
  getState,
) => {
  if (!token || !token.id) return;
  const state = getState();
  const { trip } = state.trips;
  const currency = 'usd';
  const tripId = trip._id;
  try {
    dispatch({
      type: types.MARK_TRIP_BOOKED_STATUS,
      payload: statuses.STARTED,
    });
    await axios({
      method: 'POST',
      url: `/payment/charge/${tripId}`,
      data: {
        token: token.id,
        currency: currency.toLowerCase(),
        guests,
      },
    });
    complete('success'); // instructs the browser to close the native loader
    dispatch({
      type: types.MARK_TRIP_BOOKED_STATUS,
      payload: statuses.SUCCESS,
    });
  } catch (error) {
    console.error('charge failed', error.response ? error.response.data : error);
    complete('fail');
    dispatch({
      type: types.PAYMENT_ERROR,
      payload: error.response.data,
    });
  }
};

export const payWithPls = (guests, tripId) => {
  return async dispatch => {
    try {
      dispatch({
        type: types.MARK_TRIP_BOOKED_STATUS,
        payload: statuses.STARTED,
      });
      await axios({
        method: 'POST',
        url: `/payment/pls-charge/${tripId}`,
        data: {
          guests,
        },
      });
      dispatch({
        type: types.MARK_TRIP_BOOKED_STATUS,
        payload: statuses.SUCCESS,
      });
      return 'success';
    } catch (error) {
      dispatch({
        type: types.PAYMENT_ERROR,
        payload: error.response.data,
      });
      return 'fail';
    }
  };
};
