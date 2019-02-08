import axios from 'libs/axios';
import { serverBaseURL } from 'libs/config';
import { parseTags } from 'libs/fetch_helpers';
import history from './../../main/history';
import moment from 'moment';
import { saveTrip } from 'libs/localStorage';
import apiClient from 'libs/apiClient';

const types = {
  FETCH_USER_TRIPS_START: 'FETCH_USER_TRIPS_START',
  FETCH_USER_TRIPS_SUCCESS: 'FETCH_USER_TRIPS_SUCCESS',
  FETCH_USER_TRIPS_ERROR: 'FETCH_USER_TRIPS_ERROR',
  FETCH_TRIP_START: 'FETCH_TRIP_START',
  FETCH_TRIP_SUCCESS: 'FETCH_TRIP_SUCCESS',
  FETCH_TRIP_ERROR: 'FETCH_TRIP_ERROR',
  FETCH_OWNER_START: 'FETCH_OWNER_START',
  FETCH_OWNER_SUCCESS: 'FETCH_OWNER_SUCCESS',
  CHECK_AVAILABILITY_START: 'CHECK_AVAILABILITY_START',
  CHECK_AVAILABILITY_SUCCESS: 'CHECK_AVAILABILITY_SUCCESS',
  CHECK_AVAILABILITY_ERROR: 'CHECK_AVAILABILITY_ERROR',
  CLONE_TRIP_START: 'CLONE_TRIP_START',
  CLONE_TRIP_SUCCESS: 'CLONE_TRIP_SUCCESS',
  CLONE_TRIP_ERROR: 'CLONE_TRIP_ERROR',
  PATCH_TRIP_START: 'PATCH_TRIP_START',
  PATCH_TRIP_SUCCESS: 'PATCH_TRIP_SUCCESS',
  PATCH_TRIP_ERROR: 'PATCH_TRIP_ERROR',
  SELECT_OPTION: 'SELECT_OPTION',
  RESET_TRIP: 'RESET_TRIP',
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
    const myTrips = await axios.get(`/trips`);
    dispatch(fetchUserTripsSuccess(myTrips.data.trips));
  } catch (e) {
    dispatch(fetchUserTripsError(e));
  }
};

const fetchTripStart = () => {
  return {
    type: types.FETCH_TRIP_START,
  };
};

const fetchTripError = error => {
  return {
    type: types.FETCH_TRIP_ERROR,
    payload: error.response ? error.response.data : error,
  };
};

const fetchTripSuccess = trip => {
  return {
    type: types.FETCH_TRIP_SUCCESS,
    payload: trip,
  };
};

const fetchOwnerStart = () => {
  return {
    type: types.FETCH_OWNER_START,
  };
};

const fetchOwnerSuccess = owner => {
  return {
    type: types.FETCH_OWNER_SUCCESS,
    payload: owner,
  };
};

const checkAvailabilityStart = timestamp => {
  return {
    type: types.CHECK_AVAILABILITY_START,
    timestamp,
  };
};

const checkAvailabilitySuccess = (payload, timestamp) => {
  return {
    type: types.CHECK_AVAILABILITY_SUCCESS,
    payload,
    timestamp,
  };
};

const checkAvailabilityError = (e, timestamp) => {
  return {
    type: types.CHECK_AVAILABILITY_ERROR,
    payload: e,
    timestamp,
  };
};

const cloneTripStart = () => {
  return {
    type: types.CLONE_TRIP_START,
  };
};

const cloneTripSuccess = () => {
  return {
    type: types.CLONE_TRIP_SUCCESS,
  };
};

const cloneTripError = e => {
  return {
    type: types.CLONE_TRIP_ERROR,
    payload: e,
  };
};

const selectOptionAction = payload => {
  return {
    type: types.SELECT_OPTION,
    payload,
  };
};

const patchTripStart = () => {
  return {
    type: types.PATCH_TRIP_START,
  };
};

const patchTripSuccess = () => {
  return {
    type: types.PATCH_TRIP_SUCCESS,
  };
};

const patchTripError = e => {
  return {
    type: types.PATCH_TRIP_ERROR,
    payload: e,
  };
};

const resetTrip = () => async dispatch => {
  dispatch({
    type: types.RESET_TRIP,
  });
};

const fetchTrip = (id, fetchOwner) => async dispatch => {
  dispatch(fetchTripStart());
  try {
    const trip = await axios.get(`/trips/${id}?include=services,tags,reservations`);
    dispatch(
      fetchTripSuccess({
        ...trip.data,
        tags: parseTags(trip.data.tags),
        services: trip.data.services.map(service => ({
          ...service,
          service: {
            ...service.service,
            tags: parseTags(service.service.tags),
          },
        })),
      }),
    );

    if (!fetchOwner) {
      return;
    }

    try {
      dispatch(fetchOwnerStart());
      const owner = await axios.get(`/users/${trip.data.owner}`);
      dispatch(fetchOwnerSuccess(owner.data));
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    dispatch(fetchTripError(e));
    if (e && !e.response) {
      throw e;
    }
  }
};

const checkAvailability = (id, startDate, peopleData, attempt = 1) => async dispatch => {
  const timestamp = new Date().getTime();
  const { adults, children, infants } = peopleData;

  dispatch(checkAvailabilityStart(timestamp));
  try {
    const availability = await axios.get(
      `${serverBaseURL}/trips/${id}/availability?bookingDate=${moment(startDate).format(
        'YYYY-MM-DD',
      )}&adultCount=${adults}&childrenCount=${children}&infantCount=${infants}&peopleCount=${adults +
        children +
        infants}`,
    );
    dispatch(checkAvailabilitySuccess(availability, timestamp));
  } catch (e) {
    dispatch(checkAvailabilityError(e, timestamp));
    if (attempt < 3) {
      // retry! this is a quick fix, we need a better way to handle errors
      checkAvailability(id, startDate, peopleData, attempt + 1);
    }
  }
};

const cloneTrip = (trip, userId) => async dispatch => {
  dispatch(cloneTripStart());
  try {
    const newTrip = await apiClient.trips.copy.post(trip._id, !userId);

    const newId = newTrip.data._id;
    if (!userId) {
      saveTrip({
        ...newTrip.data,
        services: trip.services,
      });
    }
    dispatch(cloneTripSuccess());
    history.push(`/trips/organize/${userId ? newId : ''}`);
  } catch (e) {
    dispatch(cloneTripError());
    console.error(e);
  }
};

const selectOption = (serviceId, optionCode) => async dispatch => {
  dispatch(
    selectOptionAction({
      serviceId,
      code: optionCode,
    }),
  );
};

const patchTrip = trip => async dispatch => {
  dispatch(patchTripStart());
  try {
    await axios.post(`/trips/${trip._id}`, trip);
    dispatch(patchTripSuccess());
  } catch (e) {
    dispatch(patchTripError(e));
  }
};

export default {
  types,
  fetchUserTrips,
  patchTrip,
  selectOption,
  cloneTrip,
  checkAvailability,
  fetchTrip,
  resetTrip,
};
