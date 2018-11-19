import Parse from 'parse';
import axios from 'libs/axios';
import validator from 'validator';
import history from './../../main/history';
import fetch_helpers from './../../libs/fetch_helpers';
import { identifyUsingSession } from 'libs/analytics';
import { serverBaseURL } from 'libs/config';
import { saveSession, getSession, removeSession } from 'libs/user-session';
import axiosOriginal from 'axios';

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
    type: this.types.LOGIN_STARTS,
  };
};

export const sessionsFetched = session => {
  return {
    type: this.types.LOGIN_SUCCESS,
    payload: session,
    meta: { analytics: identifyUsingSession(session.session) },
  };
};

export const displayLedgerLoader = boolDisplay => {
  return {
    type: this.types.TOGGLE_LEDGER_LOADER_DISPLAY,
    payload: boolDisplay,
  };
};

export const displayUpdateError = error => {
  return {
    type: this.types.UPDATE_ERROR,
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

export const set_base_currency = currency => async dispatch => {
  let er_query = fetch_helpers.build_query('ExchangeRate');
  er_query.descending('createdAt');
  er_query.first().then(result => {
    currency.rates = fetch_helpers.normalizeParseResponseData(result);
    // store to local storage
    localStorage.setItem('currency', JSON.stringify(currency));
    dispatch({
      type: types.BASE_CURRENCY_SET,
      payload: {
        baseCurrency: currency,
      },
    });
  });
};

export const getCurrentUser = () => async dispatch => {
  try {
    const session = getSession();
    if (session) {
      const currentUser = await axios.get('/users/me').catch(error => {
        console.log(error);
        if (
          error.response &&
          (error.response.data.message === 'jwt expired' ||
            error.response.data.message === 'invalid auth mechanism')
        ) {
          dispatch(logOut());
        }
      });
      if (currentUser.data) {
        const userObject = fetch_helpers.buildUserJson(currentUser.data);
        dispatch(sessionsFetched({ session: userObject }));
      }
      return;
    }
    dispatch({ type: types.NOT_LOGGED_IN });
  } catch (error) {
    console.log(error);
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
        let formData = new FormData();
        formData.append('profilePicture', file);
        dispatch({ type: 'AVATAR_UPLOAD_START' });
        const uploadedFile = await axiosOriginal.post(`${serverBaseURL}/media`, formData, {});
        if (uploadedFile) {
          const pictureUrl = uploadedFile.data.url;
          const updatedUser = await axiosOriginal
            .patch(
              `${serverBaseURL}/users/me`,
              { profilePicture: pictureUrl },
              {
                headers: {
                  Authorization: `Bearer ${session.accessToken}`,
                  'Content-Type': 'application-json',
                },
              },
            )
            .catch(error => {
              dispatch(displayUpdateError({ code: 422, error: error }));
            });
          if (updatedUser) {
            dispatch(sessionsFetched({ session: updatedUser.data }));
            dispatch(displayUpdateError({}));
            dispatch({ type: 'AVATAR_UPLOAD_FINISH' });
          }
        }
      } catch (error) {
        dispatch(displayUpdateError({ code: 422, error: error }));
        console.log(error);
      }
    }
  };
};

export const loginRequest = (email, password, { from, action }) => {
  return async dispatch => {
    dispatch(loginStarts());
    try {
      const auth0Response = await axios
        .post(`${serverBaseURL}/users/login`, { username: email, password: password })
        .catch(error => {
          dispatch(
            setLoginError({
              code: error.response.status,
              message: error.response.data.error_description,
            }),
          );
        });
      if (auth0Response) {
        const auth0Token = auth0Response.data.access_token;
        const user = await axios
          .get(`${serverBaseURL}/users/me`, { headers: { Authorization: `Bearer ${auth0Token}` } })
          .catch(error => {
            dispatch(
              setLoginError({
                code: error.response.status,
                message: error.response.data.message || error.response.data.error_description,
              }),
            );
          });
        if (user) {
          const userData = user.data;
          userData.accessToken = auth0Token;
          const userObject = fetch_helpers.buildUserJson(userData);
          dispatch(sessionsFetched({ session: userObject }));
          saveSession(userData);
          redirect(from, action);
        }
      }
    } catch (error) {
      dispatch(setLoginError({ code: 401, message: error }));
    }
  };
};

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

export const clearErrors = () => dispatch => {
  dispatch({ type: types.LOGIN_ERROR, payload: {} });
  dispatch({ type: types.METAMASK_ERROR, payload: {} });
  dispatch({ type: types.LEDGER_ERROR, payload: {} });
};
