import apiClient from 'libs/apiClient';
import { normalize } from 'normalizr';
import { trip as tripEntity } from 'libs/entities';

export const types = {
  SERVICE_MOVE_START: 'SERVICE_MOVE_START',
  SERVICE_MOVE_SUCCESS: 'SERVICE_MOVE_SUCCESS',
  SERVICE_MOVE_ERROR: 'SERVICE_MOVE_ERROR',
  SELECT_SERVICE_OPTION_START: 'SELECT_SERVICE_OPTION_START',
  SELECT_SERVICE_OPTION_SUCCESS: 'SELECT_SERVICE_OPTION_SUCCESS',
  SELECT_SERVICE_OPTION_ERROR: 'SELECT_SERVICE_OPTION_ERROR',
  REMOVE_SERVICES_START: 'REMOVE_SERVICES_START',
  REMOVE_SERVICES_SUCCESS: 'REMOVE_SERVICES_SUCCESS',
  REMOVE_SERVICES_ERROR: 'REMOVE_SERVICES_ERROR',
  REMOVE_SERVICE_START: 'REMOVE_SERVICE_START',
  REMOVE_SERVICE_SUCCESS: 'REMOVE_SERVICE_SUCCESS',
  UNDO_REMOVE_SERVICE: 'UNDO_REMOVE_SERVICE',
  UPDATE_TRIP_ENTITIES: 'UPDATE_TRIP_ENTITIES',
};

const fieldsWithTranslation = {
  title: true,
  description: true,
};

export const moveServices = data => async (dispatch, getState) => {
  dispatch({
    type: types.SERVICE_MOVE_START,
  });
  try {
    const trip = getState().tripDesigner.trip.data;
    const response = await apiClient.trips.serviceOrganizations.post(trip._id, data);

    const normalizedData = normalize(response.data, tripEntity);
    dispatch({
      type: types.UPDATE_TRIP_ENTITIES,
      payload: normalizedData,
    });
    dispatch({
      type: types.SERVICE_MOVE_SUCCESS,
      payload: normalizedData.entities.trips[trip._id],
    });
  } catch (e) {
    if (e && !e.response) {
      throw e;
    }
    dispatch({
      type: types.SERVICE_MOVE_ERROR,
      payload: e.response && e.response.data,
    });
  }
};

export const selectOption = (service, option) => async (dispatch, getState) => {
  dispatch({
    type: types.SELECT_SERVICE_OPTION_START,
  });
  try {
    const trip = getState().tripDesigner.trip.data;
    const response = await apiClient.trips.serviceOrganizations.availabilityCode.post(trip._id, [
      {
        serviceOrgId: service._id,
        availabilityCode: option.otherAttributes.availabilityCode.code,
      },
    ]);

    const normalizedData = normalize(response.data, tripEntity);
    dispatch({
      type: types.UPDATE_TRIP_ENTITIES,
      payload: normalizedData,
    });
    dispatch({
      type: types.SELECT_SERVICE_OPTION_SUCCESS,
      payload: normalizedData.entities.trips[trip._id],
    });
  } catch (e) {
    if (e && !e.response) {
      throw e;
    }
    dispatch({
      type: types.SELECT_SERVICE_OPTION_ERROR,
      payload: e.response && e.response.data,
    });
  }
};

export const removeServices = (serviceOrgIds = []) => async (dispatch, getState) => {
  if (serviceOrgIds.length === 0) {
    return;
  }
  const trip = getState().tripDesigner.trip.data;
  dispatch({
    type: types.REMOVE_SERVICES_START,
    payload: serviceOrgIds,
  });
  const response = await apiClient.trips.serviceOrganizations.delete(trip._id, serviceOrgIds);

  const normalizedData = normalize(response.data, tripEntity);
  dispatch({
    type: types.UPDATE_TRIP_ENTITIES,
    payload: normalizedData,
  });
  dispatch({
    type: types.REMOVE_SERVICES_SUCCESS,
    payload: normalizedData.entities.trips[trip._id],
  });

  //console.log(response.data)
};

export const removeService = serviceOrgId => async (dispatch, getState) => {
  const trip = getState().tripDesigner.trip.data;
  dispatch({
    type: types.REMOVE_SERVICE_START,
    payload: serviceOrgId,
  });

  setTimeout(async () => {
    const lastRemoved = getState().tripDesigner.lastRemovedService;
    if (!lastRemoved.some(elem => elem.id === serviceOrgId)) {
      return;
    }
    const response = await apiClient.trips.serviceOrganizations.delete(trip._id, [serviceOrgId]);

    const normalizedData = normalize(response.data, tripEntity);
    dispatch({
      type: types.UPDATE_TRIP_ENTITIES,
      payload: normalizedData,
    });
    dispatch({
      type: types.REMOVE_SERVICE_SUCCESS,
      payload: {
        trip: normalizedData.entities.trips[trip._id],
        removedService: serviceOrgId,
      },
    });
  }, 5000);
};

export const undoRemoveService = () => async (dispatch, getState) => {
  dispatch({
    type: types.UNDO_REMOVE_SERVICE,
  });
};
