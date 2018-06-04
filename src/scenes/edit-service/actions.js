import fetch_helpers from '../../libs/fetch_helpers';

export const types = {
  SERVICE_FETCH_STARTED: 'EDIT/SERVICE_FETCH_STARTED',
  SERVICE_FETCH_SUCCESS: 'EDIT/SERVICE_FETCH_SUCCESS',
  SERVICE_FETCH_ERROR: 'EDIT/SERVICE_FETCH_ERROR',

  SERVICE_SAVE_STARTED: 'EDIT/SERVICE_SAVE_STARTED',
  SERVICE_SAVE_SUCCCESS: 'EDIT/SERVICE_SAVE_SUCCCESS',
  SERVICE_SAVE_ERROR: 'EDIT/SERVICE_SAVE_ERROR',
};

export const fetchService = serviceId => async (dispatch, getState) => {
  if (!serviceId) return;
  const state = getState();
  const { isLoading } = state.EditService;
  if (isLoading) return;
  dispatch({ type: types.SERVICE_FETCH_STARTED });
  try {
    const result = await fetch_helpers.build_query('Service').get(serviceId);
    const service = fetch_helpers.normalizeParseResponseData(result);
    dispatch({ type: types.SERVICE_FETCH_SUCCESS, payload: service });
  } catch (error) {
    dispatch({ type: types.SERVICE_FETCH_ERROR, payload: error });
  }
};

/**
 * Converts the way values are stored in the form to the structure in which the values are stored
 * in the Service object
 */
function convertFormToServiceObj(values) {
  return {
    ...values,
    DayList: [...values.availableDays],
    availableDays: undefined,
  };
}

export const saveServiceChanges = (serviceId, values, history) => async (dispatch, getState) => {
  if (!serviceId) return;
  const state = getState();
  const { isLoading } = state.EditService;
  if (isLoading) return;
  try {
    const service = await fetch_helpers.build_query('Service').get(serviceId);
    const cleanedValues = convertFormToServiceObj(values);
    await service.save(cleanedValues);
    dispatch({ type: types.SERVICE_SAVE_SUCCCESS });
    history.push(`/services/${service.id}`);
  } catch (error) {
    dispatch({ type: types.SERVICE_SAVE_ERROR, payload: error });
  }
};
