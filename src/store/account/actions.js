import fetch_helpers from './../../libs/fetch_helpers';
import history from './../../main/history';
import { serverBaseURL, env } from 'libs/config';
import validator from 'validator';
import axios from 'libs/axios';
import { getSession } from 'libs/user-session';

export const types = {
  PROFILE_FETCHED: 'account/USER_PROFILE_FETCHED',
  SERVICES_FETCH_SUCCESS: 'ACCOUNT/MY_SERVICES_FETCH_SUCCESS',
  SERVICES_FETCH_START: 'ACCOUNT/MY_SERVICES_FETCH_START',
};

export const user_profile_fetched = user_profile => {
  return {
    type: types.PROFILE_FETCHED,
    payload: user_profile,
  };
};

export const myServicesFetched = user_services => {
  return {
    type: types.SERVICES_FETCH_SUCCESS,
    payload: user_services,
  };
};

export const myServicesFetch = () => {
  return {
    type: types.SERVICES_FETCH_START,
  };
};

export const myTripsFetched = trips => ({
  type: 'ACCOUNT/MY_TRIPS_FETCHED',
  payload: trips,
});

export const myTripsFetchStarted = trips => ({
  type: 'ACCOUNT/MY_TRIPS_FETCH_STARTED',
});

export const edit_user_error_raised = error => {
  return {
    type: 'EDIT_USER_ERROR_SET',
    payload: error,
  };
};

export const fetch_user_profile = () => async dispatch => {
  try {
    const session = getSession();
    if (session) {
      const user = await axios.get('/users/me');
      dispatch(user_profile_fetched({ user_profile: user.data }));
    } else {
      history.push('/register');
    }
  } catch (error) {
    console.log(error);
    //dispatch(setLoginError({code: error.response.status, message: error.response.data.error_description}));
  }
};

export const update_user_service_status = e => async dispatch => {
  let status = e.target.dataset.status;
  let serviceId = e.target.dataset.objectId;
  if (!serviceId || !status) {
    console.error(new Error("can't update service status without serviceId and status"));
  }
  try {
    const updatedService = await axios.patch(`/services/${serviceId}`, { status }).catch(error => {
      console.log(error);
    });
    if (updatedService) {
      dispatch(fetch_user_services());
    }
  } catch (error) {
    console.error(error);
  }
};

//const locales = ['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fr-FR', 'hu-HU', 'it-IT', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sk-SK', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA'];
export const update_user_profile = (user_id, field_type, value) => {
  return async dispatch => {
    const localStorageUser = localStorage.getItem(`deens-${env}-session`);
    if (localStorageUser) {
      try {
        const jsonUser = JSON.parse(localStorageUser);
        const currentUser = await axios
          .get(`${serverBaseURL}/users/me`, {
            headers: { Authorization: `Bearer ${jsonUser.accessToken}` },
          })
          .catch(error => {
            dispatch(edit_user_error_raised({ code: 422, error: error }));
          });
        let isUsernameValid = false;
        let isEmailValid = false;
        if (field_type === 'username') {
          isUsernameValid = validator.isAlphanumeric(value, 'en-US');
          if (!isUsernameValid) {
            dispatch(
              edit_user_error_raised({ code: 203, error: 'Username should be alphanumeric.' }),
            );
            dispatch(user_profile_fetched({ user_profile: currentUser.data }));
            return;
          }
        }
        if (field_type === 'email') {
          isEmailValid = validator.isEmail(value);
          if (!isEmailValid) {
            dispatch(
              edit_user_error_raised({ code: 203, error: 'Please, enter a valid email address.' }),
            );
            dispatch(user_profile_fetched({ user_profile: currentUser.data }));
            return;
          }
        }
        const updatedUser = await axios
          .patch(
            `${serverBaseURL}/users/me`,
            { [field_type]: value },
            { headers: { Authorization: `Bearer ${jsonUser.accessToken}` } },
          )
          .catch(error => {
            dispatch(edit_user_error_raised({ code: 422, error: error }));
          });
        dispatch(user_profile_fetched({ user_profile: updatedUser.data }));
        dispatch(edit_user_error_raised({}));
      } catch (error) {
        dispatch(edit_user_error_raised({ code: 422, error: error }));
      }
    }
  };
};

export const fetch_user_services = () => async dispatch => {
  const session = getSession();
  if (session) {
    dispatch(myServicesFetch());
    const userServices = await axios.get(`/services`);
    const services = fetch_helpers.buildServicesJson(userServices.data);

    dispatch(myServicesFetched(services));
  } else {
    history.push('/');
  }
};

export const fetchUserTrips = () => async dispatch => {
  dispatch(myTripsFetchStarted());
  const session = getSession();
  if (session) {
    const { data: trips } = await axios.get('/trips', { params: { include: 'services' } });
    dispatch(myTripsFetched(trips));
  }
};

export const clearMetamaskErrors = () => dispatch => {
  dispatch({ type: 'METAMASK_ERROR', payload: {} });
};

export const signData = () => {};
/*
// NOTE: for now it always signs "please"
export const signData = () => async dispatch => {
  // clear metamask errors
  dispatch({ type: 'METAMASK_ERROR', payload: {} });

  try {
    const [{ signMessage }, { nonce }] = await Promise.all([
      import('../../libs/web3-utils'),
      Parse.Cloud.run('getNonceForUser'),
    ]);
    const { signature } = await signMessage(nonce);
    const userObj = await Parse.Cloud.run('storePublicAddress', {
      signature: signature,
      type: 'metamask',
    });
    dispatch(fetch_user_profile());
    dispatch(
      user_profile_fetched({ user_profile: fetch_helpers.normalizeParseResponseData(userObj) }),
    );
    dispatch({ type: 'analytics', meta: { analytics: trackMetamaskConnected() } });
  } catch (error) {
    console.error(error);
    if (error.showToUser) {
      dispatch({
        type: 'METAMASK_ERROR',
        payload: {
          message: error.message,
        },
      });
    }
  }
};
*/
export const ledgerSignData = () => {};
/*
export const ledgerSignData = () => async dispatch => {
  dispatch({ type: 'LEDGER_ERROR', payload: {} });

  try {
    const [{ ledgerSignMessage }, { nonce }] = await Promise.all([
      import('../../libs/web3-utils'),
      Parse.Cloud.run('getNonceForUser'),
    ]);
    const { signature } = await ledgerSignMessage(nonce);
    const userObj = await Parse.Cloud.run('storePublicAddress', {
      signature: signature,
      type: 'ledger',
    });
    dispatch(fetch_user_profile());
    dispatch(
      user_profile_fetched({ user_profile: fetch_helpers.normalizeParseResponseData(userObj) }),
    );
    dispatch({ type: 'analytics', meta: { analytics: trackLedgerConnected() } });
  } catch (error) {
    if (error.showToUser) {
      dispatch({
        type: 'LEDGER_ERROR',
        payload: {
          message: error.message,
        },
      });
    }
  }
};
*/
