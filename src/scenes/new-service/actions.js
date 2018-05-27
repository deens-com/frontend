import Parse from 'parse';

export const types = {
  SERVICE_CREATE_STARTED: 'SERVICE_CREATE_STARTED',
  SERVICE_CREATE_SUCCESS: 'SERVICE_CREATE_SUCCESS',
  SERVICE_CREATE_ERROR: 'SERVICE_CREATE_ERROR',
};

export const registerService = values => async (dispatch, getState) => {
  const state = getState();
  const { isSubmitting } = state.NewService;
  if (isSubmitting) return;
  dispatch({ type: types.SERVICE_CREATE_STARTED });
  try {
    const result = await Parse.Cloud.run('createService', values);
    dispatch({ type: types.SERVICE_CREATE_SUCCESS, payload: result });
  } catch (error) {
    if (error.errors) {
      dispatch({ type: types.SERVICE_CREATE_ERROR, payload: error.errors });
    }
  }
};
