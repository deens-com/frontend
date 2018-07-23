import fetch_helpers from '../../libs/fetch_helpers';
import Parse from 'parse';
import { trackTripBooked } from 'libs/analytics';

export const types = {
  MARK_TRIP_BOOKED_STATUS: 'MARK_TRIP_BOOKED_STATUS',
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
