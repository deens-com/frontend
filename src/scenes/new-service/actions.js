import Parse from 'parse';

export const types = {
  SERVICE_CREATE_STARTED: 'SERVICE_CREATE_STARTED',
  SERVICE_CREATE_SUCCESS: 'SERVICE_CREATE_SUCCESS',
  SERVICE_CREATE_ERROR: 'SERVICE_CREATE_ERROR',
};

export const registerService = (values, history) => async (dispatch, getState) => {
  const state = getState();
  const { isSubmitting } = state.NewService;
  if (isSubmitting) return;
  dispatch({ type: types.SERVICE_CREATE_STARTED });
  try {
    const { mainPicture } = values;
    const parseFile = await new Parse.File(mainPicture.name, mainPicture).save();
    const result = await Parse.Cloud.run('createService', {
      ...values,
      parseFile,
      availableDays: [...values.availableDays],
    });
    dispatch({ type: types.SERVICE_CREATE_SUCCESS, payload: result });
    history.push(`/services/${result.id}`);
  } catch (error) {
    if (error.errors) {
      dispatch({ type: types.SERVICE_CREATE_ERROR, payload: error.errors });
    }
  }
};
