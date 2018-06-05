import fetch_helpers from '../../libs/fetch_helpers';

export const types = {
  MARK_TRIP_BOOKED_STARTED: 'MARK_TRIP_BOOKED_STARTED',
  MARK_TRIP_BOOKED_SUCCESS: 'MARK_TRIP_BOOKED_SUCCESS',
  MARK_TRIP_BOOKED_ERROR: 'MARK_TRIP_BOOKED_ERROR',
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
  dispatch({ type: types.MARK_TRIP_BOOKED_STARTED });
  try {
    const trip = await fetch_helpers.build_query('Trip').get(tripId);
    await trip.save({ booked: true });
    dispatch({ type: types.MARK_TRIP_BOOKED_SUCCESS });
  } catch (error) {
    dispatch({ type: types.MARK_TRIP_BOOKED_ERROR, payload: error });
  }
};
