import fetch_helpers from '../../libs/fetch_helpers';

export const types = {
  MARK_TRIP_BOOKED_STATUS: 'MARK_TRIP_BOOKED_STATUS',
};

export const tripBookingStatuses = {
  STARTED: 'started',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const markTripBooked = () => async (dispatch, getState) => {
  const state = getState();
  const { bookingStatus, trip } = state.TripsReducer;
  const tripId = trip.objectId;
  if (!tripId) return;
  if (bookingStatus === tripBookingStatuses.STARTED) return;
  dispatch({ type: types.MARK_TRIP_BOOKED_STATUS, payload: tripBookingStatuses.STARTED });
  try {
    const trip = await fetch_helpers.build_query('Trip').get(tripId);
    await trip.save({ booked: true });
    dispatch({ type: types.MARK_TRIP_BOOKED_STATUS, payload: tripBookingStatuses.SUCCESS });
  } catch (error) {
    dispatch({ type: types.MARK_TRIP_BOOKED_STATUS, payload: error });
  }
};

export const clearTripBooked = () => dispatch => dispatch({ type: types.MARK_TRIP_BOOKED_STATUS, payload: null });
