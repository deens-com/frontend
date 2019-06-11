import fetch_helpers from 'libs/fetch_helpers';
import { serverBaseURL } from 'libs/config';
import axios from 'libs/axios';
import { generateServiceSlug } from 'libs/Utils';
import { getFirstCategoryLowerCase } from 'libs/categories';
import urls from 'libs/urlGenerator';

// We should remove this actions/reducer and handle that in the component

export const types = {
  SERVICE_CREATE_STARTED: 'SERVICE_CREATE_STARTED',
  SERVICE_CREATE_SUCCESS: 'SERVICE_CREATE_SUCCESS',
  SERVICE_CREATE_ERROR: 'SERVICE_CREATE_ERROR',

  SERVICE_FETCH_STARTED: 'EDIT/SERVICE_FETCH_STARTED',
  SERVICE_FETCH_SUCCESS: 'EDIT/SERVICE_FETCH_SUCCESS',
  SERVICE_FETCH_ERROR: 'EDIT/SERVICE_FETCH_ERROR',

  SERVICE_SAVE_STARTED: 'EDIT/SERVICE_SAVE_STARTED',
  SERVICE_SAVE_SUCCESS: 'EDIT/SERVICE_SAVE_SUCCESS',
  SERVICE_SAVE_ERROR: 'EDIT/SERVICE_SAVE_ERROR',

  TOGGLE_SUBMITTING_STATE: 'TOGGLE_SUBMITTING_STATE',
  SERVICE_FORM_TAGS_FETCHED: 'SERVICE_FORM_TAGS_FETCHED',
};

export const submittingStateChanged = bool => {
  return {
    type: 'TOGGLE_SUBMITTING_STATE',
    payload: bool,
  };
};

export const serviceFormTagsOptionsFetched = payload => {
  return {
    type: 'SERVICE_FORM_TAGS_FETCHED',
    payload: payload,
  };
};

export const registerService = (values, history) => async (dispatch, getState) => {
  const state = getState();
  // const localStorageUser = localStorage.getItem(`deens-${env}-session`);
  // const jsonUser = JSON.parse(localStorageUser);
  // const jwtToken = jsonUser.accessToken;
  const { isSubmitting } = state.servicesUpsert;

  if (isSubmitting) return;
  dispatch({ type: types.SERVICE_CREATE_STARTED });

  try {
    const { acceptETH } = values;
    // let parseFile;
    // if (mainPicture) {
    //   const filename = generateFilename(mainPicture.name);
    //   if (filename.length) {
    //     parseFile = await new Parse.File(filename, mainPicture).save();
    //   }
    // }

    const service = fetch_helpers.createService(values);
    const result = await axios({
      method: 'POST',
      url: `${serverBaseURL}/services`,
      data: service,
    });

    if (acceptETH) {
      //dispatch(deployContract(result, values, history));
    } else {
      dispatch({
        type: types.SERVICE_CREATE_SUCCESS,
        payload: result,
      });
      history.push(
        urls.service.view({
          id: result.data._id,
          slug: generateServiceSlug(result.data),
          category: getFirstCategoryLowerCase(result.data.categories),
        }),
      );
    }
  } catch (error) {
    if (error.errors) {
      dispatch({ type: types.SERVICE_CREATE_ERROR, payload: error.errors });
    }
  }
};

export const fetchService = serviceId => async (dispatch, getState) => {
  if (!serviceId) return;
  const state = getState();
  const { isSubmitting } = state.servicesUpsert;
  if (isSubmitting) return;

  dispatch({ type: types.SERVICE_FETCH_STARTED });
  try {
    const result = await axios.get(`${serverBaseURL}/services/${serviceId}`);

    const service = fetch_helpers.buildServiceForView(result.data);
    dispatch({ type: types.SERVICE_FETCH_SUCCESS, payload: service });
  } catch (error) {
    dispatch({ type: types.SERVICE_FETCH_ERROR, payload: error });
  }
};

export const fetchServiceFormTagsOptions = () => {
  return async dispatch => {
    try {
      const tags = await axios.get('/tags');
      if (tags) {
        dispatch(serviceFormTagsOptionsFetched(tags.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const saveServiceChanges = (serviceId, values, history) => async (dispatch, getState) => {
  if (!serviceId) return;
  const state = getState();
  const { isSubmitting } = state.servicesUpsert;
  if (isSubmitting) return;

  dispatch({ type: types.SERVICE_SAVE_STARTED });

  try {
    const updatedService = fetch_helpers.normalizeServiceToPatch(values);
    const result = await axios({
      method: 'PATCH',
      url: `${serverBaseURL}/services/${serviceId}`,
      data: updatedService,
    });

    if (updatedService.acceptETH) {
      //dispatch(deployContract(result, updatedService, history));
    } else {
      dispatch({ type: types.SERVICE_SAVE_SUCCESS, payload: result.data });
      history.push(
        urls.service.view({
          id: result.data._id,
          slug: generateServiceSlug(result.data),
          category: getFirstCategoryLowerCase(result.data.categories),
        }),
      );
    }
  } catch (error) {
    if (error.errors) {
      dispatch({ type: types.SERVICE_SAVE_ERROR, payload: error.errors });
    }
  }
};

export const resetErrors = () => dispatch => {
  dispatch({
    type: types.SERVICE_CREATE_ERROR,
    payload: {},
  });
};
