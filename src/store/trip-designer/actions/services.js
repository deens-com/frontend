import apiClient from 'libs/apiClient';
import arrayMove from 'array-move';
import { normalize } from 'normalizr';
import { trip as tripEntity } from 'libs/entities';
import { addServiceRequest } from 'libs/trips';

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
  REMOVE_DAY_START: 'REMOVE_DAY_START',
  REMOVE_DAY_SUCCESS: 'REMOVE_DAY_SUCCESS',
  TEMPORAL_REARRANGE: 'TEMPORAL_REARRANGE',
  UNDO_REMOVE_SERVICE: 'UNDO_REMOVE_SERVICE',
  UPDATE_TRIP_ENTITIES: 'UPDATE_TRIP_ENTITIES',
  ADD_CUSTOM_SERVICE_START: 'ADD_CUSTOM_SERVICE_START',
  ADD_CUSTOM_SERVICE_SUCCESS: 'ADD_CUSTOM_SERVICE_SUCCESS',
  MODIFY_CUSTOM_SERVICE: 'MODIFY_CUSTOM_SERVICE',
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

export const removeDay = day => async (dispatch, getState) => {
  const trip = getState().tripDesigner.trip.data;
  const inDayServices = getState().entities.inDayServices;

  const notes = trip.notes[day]
    ? {
        ...trip.notes,
        [day]: undefined,
      }
    : trip.notes;

  const duration = trip.duration - 60 * 24;

  const serviceOrgs = trip.services.filter(id => inDayServices[id].day !== day).map(
    id =>
      inDayServices[id].day > day
        ? {
            ...inDayServices[id],
            day: inDayServices[id].day - 1,
          }
        : inDayServices[id],
  );

  dispatch({
    type: types.REMOVE_DAY_START,
    payload: {
      duration,
      notes,
      tripServices: serviceOrgs.map(sOrgId => sOrgId._id),
      inDayServices: serviceOrgs.reduce(
        (prev, current) => ({
          ...prev,
          [current._id]: {
            ...inDayServices[current._id],
            day: current.day,
          },
        }),
        {},
      ),
    },
  });

  await apiClient.trips.serviceOrganizations.delete(
    trip._id,
    trip.services.filter(id => inDayServices[id].day === day),
  );
  await apiClient.trips.patch(trip._id, {
    duration,
    notes,
  });

  const response = await apiClient.trips.serviceOrganizations.rearrange.post(
    trip._id,
    serviceOrgs.map(sOrg => ({
      day: sOrg.day,
      serviceOrgId: sOrg._id,
      service: sOrg.service,
    })),
  );

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
  const normalizedData = normalize(responseData, tripEntity);

  dispatch({
    type: types.UPDATE_TRIP_ENTITIES,
    payload: normalizedData,
  });
  dispatch({
    type: types.REMOVE_DAY_SUCCESS,
    payload: normalizedData.entities.trips[trip._id],
  });
};

export const temporalRearrange = (id, currentDay, idAfter, nextDay) => (dispatch, getState) => {
  const trip = getState().tripDesigner.trip.data;
  const inDayServices = getState().entities.inDayServices;

  dispatch({
    type: types.TEMPORAL_REARRANGE,
    payload: {
      services: arrayMove(trip.services, trip.services.indexOf(id), trip.services.indexOf(idAfter)),
    },
  });

  if (currentDay === nextDay) {
    return;
  }

  dispatch({
    type: types.UPDATE_TRIP_ENTITIES,
    payload: {
      entities: {
        inDayServices: {
          [id]: {
            ...inDayServices[id],
            day: nextDay,
          },
        },
      },
    },
  });
};

export const saveTemporalRearrangement = () => async (dispatch, getState) => {
  const trip = getState().tripDesigner.trip.data;
  const inDayServices = getState().entities.inDayServices;

  await apiClient.trips.serviceOrganizations.rearrange.post(
    trip._id,
    trip.services.map(sOrgId => ({
      day: inDayServices[sOrgId].day,
      serviceOrgId: sOrgId,
      service: inDayServices[sOrgId].service,
    })),
  );
};

export const addCustomService = (serviceToAdd, day) => async (dispatch, getState) => {
  dispatch({
    type: types.ADD_CUSTOM_SERVICE_START,
    payload: serviceToAdd,
  });

  const trip = getState().tripDesigner.trip.data;

  const response = await addServiceRequest(trip._id, day, serviceToAdd._id);

  const normalizedData = normalize(response.data, tripEntity);
  const updatedTrip = normalizedData.entities.trips[trip._id];

  dispatch({
    type: types.ADD_CUSTOM_SERVICE_SUCCESS,
    payload: {
      trip: updatedTrip,
      newServiceOrganization: response.data.services.find(
        s => s.day === day && s.service === serviceToAdd._id,
      ),
    },
  });
};

export const modifyCustomService = (serviceId, data) => async (dispatch, getState) => {
  dispatch({
    type: types.MODIFY_CUSTOM_SERVICE,
    payload: {
      id: serviceId,
      data,
    },
  });

  const dataWithLanguage = data.title
    ? {
        ...data,
        title: {
          en: data.title,
        },
      }
    : data;

  apiClient.services.patch(serviceId, dataWithLanguage);
};
