import axios from 'libs/axios';
import validator from 'validator';
import history from 'main/history';
import fetch_helpers from 'libs/fetch_helpers';
import { identifyUsingSession } from 'libs/analytics';
import { serverBaseURL } from 'libs/config';
import apiClient from 'libs/apiClient';
import {
  addFavoriteTrip as addFavoriteTripLocally,
  removeFavoriteTrip as removeFavoriteTripLocally,
  getFavoriteTrips as getFavoriteTripsLocally,
  clearFavoriteTrips as clearLocalFavoriteTrips,
} from 'libs/localStorage';
import { saveSession, getSession, removeSession } from 'libs/user-session';

export const types = {
  LOGIN_STARTS: 'LOGIN_STARTS',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  LOGIN_ERROR: 'LOGIN_ERROR',
  METAMASK_ERROR: 'METAMASK_ERROR',
  LEDGER_ERROR: 'LEDGER_ERROR',
  BASE_CURRENCY_SET: 'BASE_CURRENCY_SET',
  TOGGLE_LEDGER_LOADER_DISPLAY: 'TOGGLE_LEDGER_LOADER_DISPLAY',
  UPDATE_ERROR: 'UPDATE_ERROR',
  AVATAR_UPLOAD_START: 'AVATAR_UPLOAD_START',
  AVATAR_UPLOAD_FINISH: 'AVATAR_UPLOAD_FINISH',
  NOT_LOGGED_IN: 'NOT_LOGGED_IN',
  LOADED_LATEST_TRIP: 'LOADED_LATEST_TRIP',
  ADD_FAVORITE_TRIP: 'ADD_FAVORITE_TRIP',
  REMOVE_FAVORITE_TRIP: 'REMOVE_FAVORITE_TRIP',
  LOADED_FAVORITE_TRIPs: 'LOADED_FAVORITE_TRIPs',
};

function redirect(to, action) {
  history.replace({
    pathname: to || '/',
    state: {
      action,
    },
  });
}

export const loginStarts = () => {
  return {
    type: types.LOGIN_STARTS,
  };
};

export const sessionsFetched = session => {
  return {
    type: types.LOGIN_SUCCESS,
    payload: session,
    meta: { analytics: identifyUsingSession(session.session) },
  };
};

export const displayLedgerLoader = boolDisplay => {
  return {
    type: types.TOGGLE_LEDGER_LOADER_DISPLAY,
    payload: boolDisplay,
  };
};

export const displayUpdateError = error => {
  return {
    type: types.UPDATE_ERROR,
    payload: error,
  };
};

export const setLoginError = payload => {
  return {
    type: types.LOGIN_ERROR,
    payload: {
      code: payload.code,
      message: payload.message,
    },
  };
};

async function setUserData(userObject) {
  await window.fcWidget.setExternalId(userObject._id);
  await window.fcWidget.user.setFirstName(userObject.username);
  await window.fcWidget.user.setEmail(userObject.email);
}

export const getCurrentUserTrip = () => async dispatch => {
  const response = await apiClient.trips.get({ limit: 1 });
  if (response.data.trips.length === 0) {
    return;
  }
  dispatch({ type: types.LOADED_LATEST_TRIP, payload: response.data.trips[0] });
};

export const getFavoriteTrips = () => async dispatch => {
  const session = getSession();
  const savedFavoriteTrips = getFavoriteTripsLocally() || {};
  if (session) {
    try {
      const response = await apiClient.users.username.hearts.get(
        {},
        { username: session.username },
      );
      const trips = response.data.reduce(
        (obj, id) => ({
          ...obj,
          [id]: true,
        }),
        savedFavoriteTrips,
      );
      dispatch({
        type: types.LOADED_FAVORITE_TRIPs,
        payload: trips,
      });
      Object.keys(savedFavoriteTrips)
        .filter(id => savedFavoriteTrips[id])
        .forEach(apiClient.trips.heart.post);
      clearLocalFavoriteTrips();
      return;
    } catch (e) {
      console.log(e);
    }
  }
  dispatch({
    type: types.LOADED_FAVORITE_TRIPs,
    payload: savedFavoriteTrips,
  });
};

export const getCurrentUser = fetchReferralInfo => async dispatch => {
  const session = getSession();
  try {
    if (session) {
      const currentUser = await axios.get('/users/me');
      if (currentUser.data) {
        const userObject = fetch_helpers.buildUserJson(currentUser.data);
        let referralInfo;
        if (fetchReferralInfo) {
          referralInfo = (await axios.get('/users/me/referral-info')).data;
        }
        dispatch(
          sessionsFetched({
            session: {
              ...userObject,
              referralInfo,
            },
          }),
        );

        // Fresh chat data
        if (window.fcWidget && window.fcWidget.user) {
          try {
            const chatUser = (await window.fcWidget.user.get()).data;
            if (chatUser.firstName !== userObject.username) {
              await window.fcWidget.user.clear();
              await setUserData(userObject);
            }
          } catch (e) {
            if (e.status === 401) {
              await setUserData(userObject);
            }
          }
        }
      }
      return;
    }
    dispatch({ type: types.NOT_LOGGED_IN });
  } catch (error) {
    console.log(error);
    dispatch(logOut());
  }
};

export const logOut = () => dispatch => {
  removeSession();
  dispatch(sessionsFetched({ session: {} })); // why this???
  history.push('/');
};

export const update_user_profile = (user_id, field_type, value) => {
  return async dispatch => {
    const session = getSession();
    if (session) {
      try {
        const currentUser = await axios.get('/users/me').catch(error => {
          dispatch(displayUpdateError({ code: 422, error: error }));
        });
        let isUsernameValid = false;
        let isEmailValid = false;
        if (field_type === 'username') {
          isUsernameValid = validator.isAlphanumeric(value, 'en-US');
          if (!isUsernameValid) {
            dispatch(displayUpdateError({ code: 203, error: 'Username should be alphanumeric.' }));
            const userObject = fetch_helpers.buildUserJson(currentUser.data);
            dispatch(sessionsFetched({ session: userObject }));
            return;
          }
        }
        if (field_type === 'email') {
          isEmailValid = validator.isEmail(value);
          if (!isEmailValid) {
            dispatch(
              displayUpdateError({ code: 203, error: 'Please, enter a valid email address.' }),
            );
            const userObject = fetch_helpers.buildUserJson(currentUser.data);
            dispatch(sessionsFetched({ session: userObject }));
            return;
          }
        }
        const updatedUser = await axios.patch('/users/me', { [field_type]: value }).catch(error => {
          return dispatch(
            displayUpdateError({
              code: 422,
              error: error.response ? error.response.data.message : error,
            }),
          );
        });
        if (updatedUser.data) {
          const userObject = fetch_helpers.buildUserJson(updatedUser.data);
          dispatch(sessionsFetched({ session: userObject }));
          dispatch(displayUpdateError({}));
        }
      } catch (error) {
        dispatch(displayUpdateError({ code: 422, error: error }));
      }
    }
  };
};

export const update_user_avatar = file => {
  return async dispatch => {
    const session = getSession();
    if (session) {
      try {
        dispatch({ type: 'AVATAR_UPLOAD_START' });

        const uploadedFile = await apiClient.media.post(file);
        if (uploadedFile) {
          const pictureUrl = uploadedFile.data.url;
          const updatedUser = await axios.patch(`${serverBaseURL}/users/me`, {
            profilePicture: pictureUrl,
          });

          if (updatedUser) {
            dispatch(sessionsFetched({ session: updatedUser.data }));
            dispatch(displayUpdateError({}));
            dispatch({ type: 'AVATAR_UPLOAD_FINISH' });
          }
        }
      } catch (error) {
        dispatch(
          displayUpdateError({ code: 422, error: 'There was an error while uploading the file' }),
        );
      }
    }
  };
};

export const loginRequest = (email, password, { from, action }) => {
  return async dispatch => {
    dispatch(loginStarts());
    try {
      const auth0Response = await axios.post(`${serverBaseURL}/users/login`, {
        username: email,
        password: password,
      });

      if (auth0Response) {
        const auth0Token = auth0Response.data.access_token;
        const user = await axios.get(`${serverBaseURL}/users/me`, {
          headers: { Authorization: `Bearer ${auth0Token}` },
        });
        if (user) {
          const userData = user.data;
          userData.accessToken = auth0Token;
          const userObject = fetch_helpers.buildUserJson(userData);
          dispatch(sessionsFetched({ session: userObject }));
          saveSession(userData);
          getFavoriteTrips();
          redirect(from, action);
        }
      }
    } catch (error) {
      dispatch(
        setLoginError({
          code: error.response.status,
          message: error.response.data.message || error.response.data.error_description,
        }),
      );
    }
  };
};

export const addFavoriteTrip = id => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.ADD_FAVORITE_TRIP,
      payload: id,
    });
    if (!getState().session.session.username) {
      addFavoriteTripLocally(id);
      return;
    }
    apiClient.trips.heart.post(id);
  };
};

export const removeFavoriteTrip = id => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.REMOVE_FAVORITE_TRIP,
      payload: id,
    });
    if (!getState().session.session.username) {
      removeFavoriteTripLocally(id);
      return;
    }
    apiClient.trips.heart.delete(id);
  };
};

/*
export const loginWithLedger = ({ from, action }) => async dispatch => {
  try {
    const { getLedgerPublicAddress, ledgerSignMessage } = await import('libs/web3-utils');
    dispatch(displayLedgerLoader(true));
    const publicAddress = await getLedgerPublicAddress();
    const response = await Parse.Cloud.run('getMetaMaskNonce', {
      publicAddress: publicAddress,
      type: 'ledger',
    });

    if (response.code === 404) {
      dispatch({
        type: types.LEDGER_ERROR,
        payload: {
          message: response.error.message.message,
        },
      });
    }
    const { signature } = await ledgerSignMessage(response.nonce);
    const authData = {
      signature: signature.toLowerCase(),
      id: publicAddress.toLowerCase(),
      method: 'ledgerWeb3',
    };
    const user = await Parse.User.logInWith('ledgerauth', { authData });
    dispatch(sessionsFetched({ session: user }));
    redirect(from, action);
  } catch (error) {
    dispatch(displayLedgerLoader(false));
    if (error.code === 404) {
      dispatch({
        type: types.LEDGER_ERROR,
        payload: {
          message: error.message.message,
        },
      });
    } else {
      // console.error(error);
      dispatch({
        type: types.LEDGER_ERROR,
        payload: {
          message: error.message,
        },
      });
    }
  }
};

export const loginWithMetamask = () => async dispatch => {
  try {
    const { getPublicAddress, signMessage } = await import('libs/web3-utils');
    const publicAddress = await getPublicAddress();
    const response = await Parse.Cloud.run('getMetaMaskNonce', { publicAddress, type: 'metamask' });
    const { signature } = await signMessage(response.nonce);
    const authData = {
      signature,
      id: publicAddress,
      method: 'metamaskWeb3',
    };
    const user = await Parse.User.logInWith('metamaskauth', { authData });
    dispatch(sessionsFetched({ session: user }));
    history.goBack();
  } catch (error) {
    console.error(error);
    if (error.showToUser) {
      dispatch({
        type: types.METAMASK_ERROR,
        payload: {
          message: error.message,
        },
      });
    } else if (error.code === 141) {
      // parse function error
      const innerError = error.message;
      dispatch({
        type: types.METAMASK_ERROR,
        payload: {
          message: innerError.message,
        },
      });
    }
  }
};
*/
export const clearErrors = () => dispatch => {
  dispatch({ type: types.LOGIN_ERROR, payload: {} });
  dispatch({ type: types.METAMASK_ERROR, payload: {} });
  dispatch({ type: types.LEDGER_ERROR, payload: {} });
};
