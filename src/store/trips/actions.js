import axios from 'libs/axios';
import fetchHelpers from 'libs/fetch_helpers';

const types = {
  FETCH_USER_TRIPS_START: 'FETCH_USER_TRIPS_START',
  FETCH_USER_TRIPS_SUCCESS: 'FETCH_USER_TRIPS_SUCCESS',
  FETCH_USER_TRIPS_ERROR: 'FETCH_USER_TRIPS_ERROR',
};

const fetchUserTripsStart = () => ({ type: types.FETCH_USER_TRIPS_START });

const fetchUserTripsSuccess = trips => ({
  type: types.FETCH_USER_TRIPS_SUCCESS,
  payload: trips,
});

const fetchUserTripsError = error => ({
  type: types.FETCH_USER_TRIPS_ERROR,
  payload: error,
});

const fetchUserTrips = (serviceId, slotsNb) => async dispatch => {
  dispatch(fetchUserTripsStart());
  try {
    const myTrips = await axios.get(`/trips?include=service`);
    dispatch(fetchUserTripsSuccess(fetchHelpers.buildServicesJson(myTrips.data)));
  } catch (e) {
    dispatch(fetchUserTripsError(e));
  }
};

export default {
  types,
  fetchUserTrips,
};
