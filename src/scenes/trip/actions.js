import axios from 'libs/axios';
import { serverBaseURL } from 'libs/config';

export const types = {
  FETCH_TRIP_START: 'FETCH_TRIP_START',
  FETCH_TRIP_SUCCESS: 'FETCH_TRIP_SUCCESS',
  FETCH_TRIP_ERROR: 'FETCH_TRIP_ERROR',
  FETCH_OWNER_START: 'FETCH_OWNER_START',
  FETCH_OWNER_SUCCESS: 'FETCH_OWNER_SUCCESS',
};

export const fetchTripStart = () => {
  return {
    type: types.FETCH_TRIP_START,
  };
};

export const fetchTripError = error => {
  return {
    type: types.FETCH_TRIP_ERROR,
    payload: error.response.data,
  };
};

export const fetchTripSuccess = trip => {
  return {
    type: types.FETCH_TRIP_SUCCESS,
    payload: trip.data,
  };
};

export const fetchOwnerStart = () => {
  return {
    type: types.FETCH_OWNER_START,
  };
};

export const fetchOwnerSuccess = owner => {
  return {
    type: types.FETCH_OWNER_SUCCESS,
    payload: owner.data,
  };
};

export const fetchTrip = id => async dispatch => {
  dispatch(fetchTripStart());
  try {
    const trip = await axios.get(`${serverBaseURL}/trips/${id}`);
    dispatch(fetchTripSuccess(trip));

    try {
      dispatch(fetchOwnerStart());
      const owner = await axios.get(`${serverBaseURL}/users/${trip.data.owner}`);
      dispatch(fetchOwnerSuccess(owner));
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    dispatch(fetchTripError(e));
  }
};
