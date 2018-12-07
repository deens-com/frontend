import axios from 'libs/axios';
import { serverBaseURL } from 'libs/config';
import { parseTags } from 'libs/fetch_helpers';
import history from './../../main/history';
import moment from 'moment';
import { saveTrip } from 'libs/localStorage';

export const types = {
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
    payload: trip,
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

export const checkAvailabilityStart = timestamp => {
  return {
    type: types.CHECK_AVAILABILITY_START,
    timestamp,
  };
};

export const checkAvailabilitySuccess = (payload, timestamp) => {
  return {
    type: types.CHECK_AVAILABILITY_SUCCESS,
    payload,
    timestamp,
  };
};

export const checkAvailabilityError = (e, timestamp) => {
  return {
    type: types.CHECK_AVAILABILITY_ERROR,
    payload: e,
    timestamp,
  };
};

export const cloneTripStart = () => {
  return {
    type: types.CLONE_TRIP_START,
  };
};

export const cloneTripSuccess = () => {
  return {
    type: types.CLONE_TRIP_SUCCESS,
  };
};

export const cloneTripError = e => {
  return {
    type: types.CLONE_TRIP_ERROR,
    payload: e,
  };
};

export const selectOptionAction = payload => {
  return {
    type: types.SELECT_OPTION,
    payload,
  };
};

export const patchTripStart = () => {
  return {
    type: types.PATCH_TRIP_START,
  };
};

export const patchTripSuccess = () => {
  return {
    type: types.PATCH_TRIP_SUCCESS,
  };
};

export const patchTripError = e => {
  return {
    type: types.PATCH_TRIP_ERROR,
    payload: e,
  };
};

export const resetTrip = () => async dispatch => {
  dispatch({
    type: types.RESET_TRIP,
  });
};

export const fetchTrip = id => async dispatch => {
  dispatch(fetchTripStart());
  try {
    const trip = await axios.get(`${serverBaseURL}/trips/${id}?include=services,tags,reservations`);
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

    try {
      dispatch(fetchOwnerStart());
      const owner = await axios.get(`${serverBaseURL}/users/${trip.data.owner}`);
      dispatch(fetchOwnerSuccess(owner));
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    console.log(e);
    dispatch(fetchTripError(e));
  }
};

export const checkAvailability = (id, startDate, peopleData, attempt = 1) => async dispatch => {
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

export const cloneTrip = (id, userId) => async dispatch => {
  dispatch(cloneTripStart());
  try {
    const newTrip = userId
      ? await axios.post(`${serverBaseURL}/trips/copy/${id}`)
      : await axios.get(`${serverBaseURL}/trips/${id}?include=services`);

    const newId = newTrip.data._id;
    if (!userId) {
      delete newTrip.data._id;
      saveTrip(newTrip.data);
    }
    dispatch(cloneTripSuccess());
    history.push(`/trips/organize/${userId ? newId : ''}`);
  } catch (e) {
    dispatch(cloneTripError());
    console.error(e);
  }
};

export const selectOption = (serviceId, optionCode) => async dispatch => {
  dispatch(
    selectOptionAction({
      serviceId,
      code: optionCode,
    }),
  );
};

export const patchTrip = trip => async dispatch => {
  dispatch(patchTripStart());
  try {
    await axios.post(`/trips/${trip._id}`, trip);
    dispatch(patchTripSuccess());
  } catch (e) {
    dispatch(patchTripError(e));
  }
};
