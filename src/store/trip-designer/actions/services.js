import apiClient from 'libs/apiClient';
import { normalize } from 'normalizr';
import { trip as tripEntity } from 'libs/entities';

export const types = {
  SERVICE_MOVE_START: 'SERVICE_MOVE_START',
  SERVICE_MOVE_SUCCESS: 'SERVICE_MOVE_SUCCESS',
  SERVICE_MOVE_ERROR: 'SERVICE_MOVE_ERROR',
};

export const moveServices = data => async (dispatch, getState) => {
  dispatch({
    type: types.SERVICE_MOVE_START,
  });
  try {
    const trip = getState().tripDesigner.trip.data;
    const response = await apiClient.trips.serviceOrganizations.post(trip._id, data);

    const normalizedData = normalize(response.data, tripEntity);
    console.log(normalizedData);
    /*dispatch({
      type: types.SERVICE_MOVE_SUCCESS,
      payload: normalizedData,
    });*/
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
