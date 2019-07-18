import moment from 'moment';
import apiClient from 'libs/apiClient';
import { normalize } from 'normalizr';
import * as fetchActions from './fetch';
import * as servicesActions from './services';
import axios, { CancelToken } from 'libs/axios';
import { tripTransport, trip as tripEntity } from 'libs/entities';

const types = {
  ...fetchActions.types,
  ...servicesActions.types,
  LOAD_TRANSPORTS_START: 'LOAD_TRANSPORTS_START',
  LOAD_TRANSPORTS_SUCCESS: 'LOAD_TRANSPORTS_SUCCESS',
  CHECK_AVAILABILITY_START: 'TD_CHECK_AVAILABILITY_START',
  CHECK_AVAILABILITY_SUCCESS: 'TD_CHECK_AVAILABILITY_SUCCESS',
  CHECK_AVAILABILITY_ERROR: 'TD_CHECK_AVAILABILITY_ERROR',
  PATCH_TRIP_START: 'TD_PATCH_TRIP_START',
  PATCH_TRIP_SUCCESS: 'TD_PATCH_TRIP_SUCCESS',
  PATCH_TRIP_ERROR: 'TD_PATCH_TRIP_ERROR',
  UPDATE_TRIP_ENTITIES: 'UPDATE_TRIP_ENTITIES',
};

function addLang(text) {
  // this should be current language
  return {
    en: text,
  };
}

// trasportation
const requestTransportation = async id =>
  normalize((await apiClient.trips.calculateDistances.post(id)).data, [tripTransport]);

const getTransportation = () => async (dispatch, getState) => {
  const trip = getState().tripDesigner.trip.data;

  if (!trip) {
    return;
  }
  dispatch({ type: types.LOAD_TRANSPORTS_START });
  try {
    const transportation = await requestTransportation(trip._id);
    dispatch({
      type: types.LOAD_TRANSPORTS_SUCCESS,
      payload: transportation.entities.tripTransports,
    });
  } catch (e) {
    dispatch({ type: types.LOAD_TRANSPORTS_ERROR });
  }
};

const selectTransport = (transport, fromServiceId, toServiceId, position = 'middle') => async (
  dispatch,
  getState,
) => {
  const body = {
    position,
    fromServiceOrganizationId: fromServiceId,
    toServiceOrganizationId: toServiceId,
    transportMode: transport,
  };

  const trip = getState().tripDesigner.trip.data;
  if (!trip) {
    return;
  }

  dispatch({ type: types.LOAD_TRANSPORTS_START });

  await apiClient.trips.transports.post(trip._id, body);
  const transportation = await requestTransportation(trip._id);

  dispatch({
    type: types.LOAD_TRANSPORTS_SUCCESS,
    payload: transportation.entities.tripTransports,
  });
};

let cancelAvailability;

const checkAvailability = () => async (dispatch, getState) => {
  if (cancelAvailability) {
    cancelAvailability();
  }

  dispatch({ type: types.CHECK_AVAILABILITY_START });

  try {
    const trip = getState().tripDesigner.trip.data;
    const { startDate, adultCount, infantCount, childrenCount } = trip;
    const bookingDate = moment(startDate).format('YYYY-MM-DD');
    const peopleCount = adultCount + infantCount + childrenCount;
    const data = { bookingDate, adultCount, childrenCount, infantCount, peopleCount };

    const response = await apiClient.trips.availability.get(trip._id, data, {
      cancelToken: new CancelToken(c => (cancelAvailability = c)),
    });

    const tripNormalized = normalize(response.data.trip, tripEntity);
    dispatch({ type: types.UPDATE_TRIP_ENTITIES, payload: tripNormalized });
    dispatch({ type: types.CHECK_AVAILABILITY_SUCCESS, payload: response.data.availabilities });
  } catch (e) {
    if (axios.isCancel(e)) {
      return;
    }
    dispatch({ type: types.CHECK_AVAILABILITY_ERROR, payload: e.response ? e.response.data : e });
  }
};

const fieldsWithTranslation = {
  title: true,
  description: true,
};

const editTrip = newData => async (dispatch, getState) => {
  const trip = getState().tripDesigner.trip.data;
  dispatch({ type: types.PATCH_TRIP_START, payload: { ...trip, ...newData } });

  let dataForRequest = {
    ...newData,
  };
  Object.keys(dataForRequest).forEach(key => {
    if (fieldsWithTranslation[key]) {
      dataForRequest[key] = addLang(dataForRequest[key]);
    }
  });

  try {
    const response = await apiClient.trips.patch(trip._id, dataForRequest);

    // START this should be done in the backend
    let responseData = {
      ...response.data,
    };
    Object.entries(responseData).forEach(([key, value]) => {
      if (fieldsWithTranslation[key]) {
        responseData[key] = responseData[key].en;
      }
    });
    // END this should be done in the backend
    const normalized = normalize(responseData, tripEntity);

    dispatch({ type: types.UPDATE_TRIP_ENTITIES, payload: normalized });
    dispatch({ type: types.PATCH_TRIP_SUCCESS, payload: normalized });
  } catch (e) {
    dispatch({ type: types.PATCH_TRIP_ERROR, error: e.response && e.response.data, payload: trip });
  }
};

export default {
  ...fetchActions,
  ...servicesActions,
  types,
  getTransportation,
  checkAvailability,
  selectTransport,
  editTrip,
};
