import axios from 'libs/axios';
import history from 'main/history';
import fetch_helpers from 'libs/fetch_helpers';
import analytics from 'libs/analytics';
import { serverBaseURL } from 'libs/config';
import apiClient from 'libs/apiClient';
import { signAndUploadImage, MEDIA_IMAGE } from 'libs/trips';
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
  LOADED_FAVORITE_TRIPS: 'LOADED_FAVORITE_TRIPS',
  MODIFY_USER: 'MODIFY_USER',
  IS_LOADING: 'IS_LOADING',
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

export const getCurrentUserTrip = () => async (dispatch, getState) => {
  try {
    if (!getState().session.session._id) {
      return;
    }
    const response = await apiClient.trips.get({ limit: 1 });
    if (response.data.trips.length === 0) {
      return;
    }
    dispatch({ type: types.LOADED_LATEST_TRIP, payload: response.data.trips[0] });
  } catch (e) {
    return;
  }
};

export const changeCurrentUserTrip = trip => async dispatch => {
  dispatch({ type: types.LOADED_LATEST_TRIP, payload: trip });
};

export const getFavoriteTrips = () => async (dispatch, getState) => {
  const sessionData = getState().session.session;

  const savedFavoriteTrips = getFavoriteTripsLocally() || {};
  try {
    if (!sessionData.username) {
      return;
    }
    const response = (await apiClient.users.username.hearts.get(
      {},
      { username: sessionData.username },
    )).data;
    const trips = response.reduce(
      (obj, id) => ({
        ...obj,
        [id]: true,
      }),
      savedFavoriteTrips,
    );
    dispatch({
      type: types.LOADED_FAVORITE_TRIPS,
      payload: trips,
    });
    Object.keys(savedFavoriteTrips)
      .filter(id => savedFavoriteTrips[id])
      .forEach(apiClient.trips.heart.post);

    if (sessionData.username) {
      clearLocalFavoriteTrips();
    }
  } catch (e) {
    dispatch({
      type: types.LOADED_FAVORITE_TRIPS,
      payload: savedFavoriteTrips,
    });
  }
};

export const getCurrentUser = fetchReferralInfo => async (dispatch, getState) => {
  let session = getSession();
  let currentUser;

  if (!session) {
    const anonymous = (await apiClient.users.signup.anonymously.post()).data;
    saveSession({ accessToken: anonymous.access_token });
    const currentUser = (await apiClient.users.me.get()).data;
    currentUser.accessToken = anonymous.access_token;
    saveSession(currentUser);
    session = currentUser;
  }

  try {
    const sessionData = getState().session.session;

    if (
      sessionData &&
      sessionData._id !== undefined &&
      sessionData.confirmedByRequest &&
      sessionData._id === session._id
    ) {
      return;
    }

    currentUser = currentUser || (await apiClient.users.me.get()).data;

    if (currentUser) {
      const userObject = fetch_helpers.buildUserJson(currentUser);
      let referralInfo;
      if (userObject.username && fetchReferralInfo) {
        referralInfo = (await apiClient.users.me.referralInfo.get()).data;
      }
      dispatch(
        sessionsFetched({
          session: {
            ...userObject,
            referralInfo,
          },
        }),
      );
    }
    return;
  } catch (error) {
    console.log(error);
    dispatch(logOut());
  }
};

export const logOut = () => dispatch => {
  removeSession();
  dispatch(sessionsFetched({ session: {} })); // why this???
  dispatch(changeCurrentUserTrip(null));
  dispatch(getCurrentUser());
  history.push('/');
};

export const update_user_profile = (user_id, field_type, value) => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.MODIFY_USER,
      payload: {
        [field_type]: value,
      },
    });
    const state = getState();
    const session = state.session.session;
    if (session) {
      try {
        const updatedUser = await apiClient.users.me.patch({ [field_type]: value });
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

        const uploadedFile = await signAndUploadImage(file, MEDIA_IMAGE);
        if (uploadedFile) {
          const updatedUser = await apiClient.users.me.patch({
            profilePicture: uploadedFile,
          });

          if (updatedUser.data) {
            dispatch(sessionsFetched({ session: updatedUser.data }));
            dispatch(displayUpdateError({}));
            dispatch({ type: 'AVATAR_UPLOAD_FINISH' });
          }
        }
      } catch (error) {
        dispatch(displayUpdateError({ code: 422, error: error.message }));
      }
    }
  };
};

export const loginRequest = (email, password, { from, action }) => {
  return async dispatch => {
    dispatch(loginStarts());
    try {
      const auth0Response = await axios.post(
        `${serverBaseURL}/users/login`,
        {
          username: email,
          password: password,
        },
        {
          headers: {
            'X-Timezone':
              Intl &&
              Intl.DateTimeFormat() &&
              Intl.DateTimeFormat().resolvedOptions() &&
              Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        },
      );

      if (auth0Response) {
        const auth0Token = auth0Response.data.access_token;
        saveSession({ accessToken: auth0Token });
        const user = await apiClient.users.me.get();
        if (user) {
          const userData = user.data;
          analytics.user.login(userData);
          userData.accessToken = auth0Token;
          const userObject = fetch_helpers.buildUserJson(userData);
          dispatch(sessionsFetched({ session: userObject }));
          saveSession(userData);
          getFavoriteTrips();
          dispatch(getCurrentUserTrip());
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
