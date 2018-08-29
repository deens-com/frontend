import Parse from 'parse';
import history from './../../main/history';
import fetch_helpers from './../../libs/fetch_helpers';
import { identifyUsingSession } from 'libs/analytics';
import axios from 'axios';
import { serverBaseURL, env } from 'libs/config';

export const types = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  LOGIN_ERROR: 'LOGIN_ERROR',
  METAMASK_ERROR: 'METAMASK_ERROR',
  LEDGER_ERROR: 'LEDGER_ERROR',
  BASE_CURRENCY_SET: 'BASE_CURRENCY_SET',
  TOGGLE_LEDGER_LOADER_DISPLAY: 'TOGGLE_LEDGER_LOADER_DISPLAY',
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

export const setLoginError = payload => {
  return dispatch => {
    dispatch({
      type: types.LOGIN_ERROR,
      payload: {
        code: payload.code,
        message: payload.message,
      },
    });
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

export const loginRequest = (email, password) => {
  return async dispatch => {
    try {
      const auth0Response = await axios.post(
        `${serverBaseURL}/users/login`,
        { username: email, password: password },
      ).catch( error => {
        dispatch(setLoginError({code: error.response.status, message: error.response.data.error_description}));
      });
      if (auth0Response) {
        const auth0Token = auth0Response.data.access_token;
        const user = await axios.get(
          `${serverBaseURL}/users/me`,
          { headers: {'Authorization': `Bearer ${auth0Token}`} }
        ).catch( error => {
          dispatch(setLoginError({code: error.response.status, message: error.response.data.error_description}));
        });
        dispatch(sessionsFetched({ session: user.data }));
        localStorage.setItem(`please-${env}-session`, JSON.stringify(user.data));
        history.goBack();
      }
    } catch (error) {
      dispatch(setLoginError({code: 401, message: error}));
    }
  };
};

export const loginWithLedger = () => async dispatch => {
  try {
    const { getLedgerPublicAddress, ledgerSignMessage } = await import('libs/web3-utils');
    dispatch(displayLedgerLoader(true));
    const publicAddress = await getLedgerPublicAddress();
    const response = await Parse.Cloud.run('getMetaMaskNonce', {
      publicAddress: publicAddress,
      type: 'ledger',
    });
    console.log(response);
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
    history.goBack();
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
