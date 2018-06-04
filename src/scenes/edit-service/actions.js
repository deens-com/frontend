import fetch_helpers from '../../libs/fetch_helpers';

export const types = {
  SERVICE_FETCH_STARTED: 'EDIT/SERVICE_FETCH_STARTED',
  SERVICE_FETCH_SUCCESS: 'EDIT/SERVICE_FETCH_SUCCESS',
  SERVICE_FETCH_ERROR: 'EDIT/SERVICE_FETCH_ERROR',
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
