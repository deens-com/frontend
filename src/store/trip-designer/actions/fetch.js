import apiClient from 'libs/apiClient';
import { normalize } from 'normalizr';
import { trip as tripEntity } from 'libs/entities';

export const types = {
  FETCH_TRIP_START: 'FETCH_TRIP_DESIGNER_START',
  FETCH_TRIP_SUCCESS: 'FETCH_TRIP_DESIGNER_SUCCESS',
  FETCH_TRIP_ERROR: 'FETCH_TRIP_DESIGNER_ERROR',
};

export const fetchTrip = id => async dispatch => {
  dispatch({
    type: types.FETCH_TRIP_START,
  });
  try {
    const response = await apiClient.trips.getById(
      { include: ['services', 'tags', 'reservations'] },
      id,
    );
    const trip = response.data;

    const normalizedData = normalize(trip, tripEntity);

    dispatch({
      type: types.FETCH_TRIP_SUCCESS,
      payload: normalizedData,
    });
  } catch (e) {
    if (e && !e.response) {
      throw e;
    }
    dispatch({
      type: types.FETCH_TRIP_ERROR,
      payload: e.response && e.response.data,
    });
  }
};
