import Parse from 'parse';
import fetch_helpers from './../../libs/fetch_helpers';
import { tagsColorMatcher } from './../../libs/Utils';
import { serverBaseURL } from 'libs/config';
import axios from 'libs/axios';

export const fetchTripsStart = () => {
  return {
    type: 'TRIPS_FETCH_STARTED',
  };
};

export const fetchTripsError = () => {
  return {
    type: 'TRIPS_FETCH_ERROR',
  };
};

export const fetchTripsSuccess = trips => {
  return {
    type: 'TRIPS_FETCH_SUCCESS',
    payload: trips,
  };
};

export const fetchTrips = () => {
  return async dispatch => {
    try {
      dispatch(fetchTripsStart());
      const res = await axios.get(`${serverBaseURL}/search?include=owner`);
      dispatch(fetchTripsSuccess(res.data.trips));
    } catch (e) {
      console.error(e);
      dispatch(fetchTripsError());
    }
  };
};
