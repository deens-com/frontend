import Parse from 'parse';
import axios from 'libs/axios';
import fetch_helpers from 'libs/fetch_helpers';
import { trackTripBooked } from 'libs/analytics';

export const types = {
  MARK_TRIP_BOOKED_STATUS: 'MARK_TRIP_BOOKED_STATUS',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
};

const { statuses } = fetch_helpers;

export const markTripBooked = () => async (dispatch, getState) => {
  const state = getState();
  const { bookingStatus, trip } = state.TripsReducer;
  const tripId = trip.objectId;
  if (!tripId) return;
  if (bookingStatus === statuses.STARTED) return;
  dispatch({ type: types.MARK_TRIP_BOOKED_STATUS, payload: statuses.STARTED });
  try {
    await Parse.Cloud.run('bookTrip', { tripId });
    dispatch({
      type: types.MARK_TRIP_BOOKED_STATUS,
      payload: statuses.SUCCESS,
      meta: { analytics: trackTripBooked(tripId) },
    });
  } catch (error) {
    dispatch({ type: types.MARK_TRIP_BOOKED_STATUS, payload: error });
  }
};

export const clearTripBooked = () => dispatch =>
  dispatch({ type: types.MARK_TRIP_BOOKED_STATUS, payload: null });

export const chargeStripeToken = (token, complete = () => {}) => async (dispatch, getState) => {
  if (!token || !token.id) return;
  const state = getState();
  const { trip } = state.TripsReducer;
  const currency =
    (state.SessionsReducer.baseCurrency && state.SessionsReducer.baseCurrency.value) || 'usd';
  const tripId = trip.objectId;
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
      },
    });
    complete('success'); // instructs the browser to close the native loader
    dispatch({
      type: types.MARK_TRIP_BOOKED_STATUS,
      payload: statuses.SUCCESS,
      meta: { analytics: trackTripBooked(tripId) },
    });
  } catch (error) {
    console.error('charge failed', error);
    let payload = error;
    if (error.response.data) payload = error.response.data;
    dispatch({
      type: types.PAYMENT_ERROR,
      payload,
    });
    complete('fail');
  }
};

export const setPaymentError = error => (dispatch, getState) => {
  if (!error) return;
  dispatch({
    type: types.PAYMENT_ERROR,
    payload: error,
  });
};
