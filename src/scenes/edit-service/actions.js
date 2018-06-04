import Parse from 'parse';
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

export const saveServiceChanges = (serviceId, values, history) => async (dispatch, getState) => {
  if (!serviceId) return;
  const state = getState();
  const { isLoading } = state.EditService;
  if (isLoading) return;
  dispatch({ type: types.SERVICE_SAVE_STARTED });
  try {
    const rawService = await fetch_helpers.build_query('Service').get(serviceId);
    const service = fetch_helpers.normalizeParseResponseData(rawService);
    const input = {
      id: serviceId,
      ...service,
      ...values,
      availableDays: [...values.availableDays],
    };
    const result = await Parse.Cloud.run('createOrUpdateService', input);
    dispatch({ type: types.SERVICE_SAVE_SUCCCESS, payload: result });
    // TODO: @vlad update smart contract
    history.push(`/services/${result.id}`);
  } catch (error) {
    if (error.errors) {
      dispatch({ type: types.SERVICE_SAVE_ERROR, payload: error.errors });
    }
  }
};
