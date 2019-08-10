import moment from 'moment';
import apiClient from 'libs/apiClient';
import { normalize } from 'normalizr';
import * as fetchActions from './fetch';
import * as servicesActions from './services';
import axios, { CancelToken } from 'libs/axios';
import { tripTransport, tag as tagEntity, trip as tripEntity } from 'libs/entities';

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
  DELETE_TRIP_START: 'DELETE_TRIP_START',
  DELETE_TRIP_SUCCESS: 'DELETE_TRIP_SUCCESS',
  DELETE_TRIP_ERROR: 'DELETE_TRIP_ERROR',
  FETCH_TAGS_SUCCESS: 'FETCH_TAGS_SUCCESS',
  FETCH_TAGS_ERROR: 'FETCH_TAGS_ERROR',
  UPDATE_MEDIA_START: 'UPDATE_MEDIA_START',
  UPDATE_MEDIA_SUCCESS: 'UPDATE_MEDIA_SUCCESS',
  UPDATE_MEDIA_ERROR: 'UPDATE_MEDIA_ERROR',
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
      payload: transportation.entities.tripTransports || {},
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

  try {
    const trip = getState().tripDesigner.trip.data;
    const { adultCount, infantCount, childrenCount } = trip;
    const adults = adultCount || 2;
    const startDate = moment(trip.startDate);
    const bookingDate = moment(startDate).format('YYYY-MM-DD');
    const peopleCount = adults + infantCount + childrenCount;
    const data = { bookingDate, adultCount: adults, childrenCount, infantCount, peopleCount };

    if (!trip.startDate || startDate.isBefore(moment(), 'day')) {
      return;
    }

    dispatch({ type: types.CHECK_AVAILABILITY_START });

    const response = await apiClient.trips.availability.get(trip._id, data, {
      cancelToken: new CancelToken(c => (cancelAvailability = c)),
    });

    const tripNormalized = normalize(response.data.trip, tripEntity);
    dispatch({ type: types.UPDATE_TRIP_ENTITIES, payload: tripNormalized });

    dispatch({
      type: types.CHECK_AVAILABILITY_SUCCESS,
      payload: {
        trip: tripNormalized.entities.trips[tripNormalized.result],
        availabilities: response.data.availabilities,
      },
    });
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
    const normalized = normalize(response.data, tripEntity);

    dispatch({ type: types.UPDATE_TRIP_ENTITIES, payload: normalized });
    dispatch({ type: types.PATCH_TRIP_SUCCESS, payload: normalized });
  } catch (e) {
    dispatch({ type: types.PATCH_TRIP_ERROR, error: e.response && e.response.data, payload: trip });
  }
};

const deleteTrip = newData => async (dispatch, getState) => {
  const trip = getState().tripDesigner.trip.data;
  dispatch({ type: types.DELETE_TRIP_START });
  try {
    const response = await apiClient.trips.delete(trip._id);
    const normalized = normalize(response.data, tripEntity);
    dispatch({ type: types.DELETE_TRIP_SUCCESS, payload: normalized });
  } catch (e) {
    dispatch({
      type: types.DELETE_TRIP_ERROR,
      error: e.response && e.response.data,
      payload: trip,
    });
  }
};

const fetchTags = () => async (dispatch, getState) => {
  try {
    const tagsResponse = await apiClient.tags.get();
    const tags = tagsResponse.data.map(tag => ({
      ...tag,
      value: tag.names,
    }));
    dispatch({ type: types.FETCH_TAGS_SUCCESS, payload: tags });
  } catch (e) {
    dispatch({ type: types.FETCH_TAGS_ERROR, error: e.response && e.response.data });
  }
};

const addTagsToEntities = tags => dispatch => {
  const normalized = normalize(tags, [tagEntity]);
  dispatch({ type: types.UPDATE_TRIP_ENTITIES, payload: normalized });
};

const updateMedia = data => async (dispatch, getState) => {
  const trip = getState().tripDesigner.trip.data;
  dispatch({
    type: types.UPDATE_MEDIA_START,
    payload: [
      ...trip.media,
      {
        ...data,
        files: {
          original: {
            url: data.url,
          },
        },
      },
    ],
  });
  try {
    const media = await apiClient.media.trips.post(data, trip._id);
    dispatch({ type: types.UPDATE_MEDIA_SUCCESS, payload: media.data });
  } catch (e) {
    dispatch({ type: types.UPDATE_MEDIA_ERROR, payload: trip.data.media });
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
  deleteTrip,
  fetchTags,
  addTagsToEntities,
  updateMedia,
};
