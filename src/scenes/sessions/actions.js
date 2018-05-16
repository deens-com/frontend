import Parse from "parse";
import history from "./../../main/history";
import { getPublicAddress, signMessage, getLedgerPublicAddress, ledgerSignMessage } from '../../libs/web3-utils';

export const types = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  LOGIN_ERROR: "LOGIN_ERROR",
  METAMASK_ERROR: "METAMASK_ERROR",
  LEDGER_ERROR: "LEDGER_ERROR"
};

export const sessionsFetched = session => {
  return {
    type: this.types.LOGIN_SUCCESS,
    payload: session
  };
};

export const login_error = (message) => {
  return dispatch => {
    dispatch({
      type: types.LOGIN_ERROR,
      payload: {
        code: '203',
        message: message
      }
    });
  }
}

export const loginRequest = (email, password) => {
  return dispatch => {
    Parse.User.logIn(email, password).then(
      user => {
        dispatch(sessionsFetched({ session: user }));
        history.push("/");
      },
      error => {
        if (error.code === 101) {
          dispatch({
            type: types.LOGIN_ERROR,
            payload: {
              code: error.code,
              message: "Invalid email or password"
            }
          });
        }
      }
    );
  };
};

export const loginWithLedger = () => async dispatch => {
  try {
    const publicAddress = await getLedgerPublicAddress();
    const response = await Parse.Cloud.run('getMetaMaskNonce', { publicAddress: publicAddress, type: "ledger" });
    const { signature } = await ledgerSignMessage(response.nonce);
    const authData = {
      signature,
      id: publicAddress,
      method: 'ledgerWeb3',
    };
    const user = await Parse.User.logInWith('ledgerauth', { authData });
    dispatch(sessionsFetched({ session: user }));
    history.push('/');
  } catch (error) {
    console.error(error);
    if (error.showToUser) {
      dispatch({
        type: types.LEDGER_ERROR,
        payload: {
          message: error.message,
        },
      });
    } else if (error.code === 141) {
      // parse function error
      const innerError = error.message;
      dispatch({
        type: types.LEDGER_ERROR,
        payload: {
          message: innerError.message,
        },
      });
    }
  }
};

export const loginWithMetamask = () => async dispatch => {
  try {
    const publicAddress = await getPublicAddress();
    const response = await Parse.Cloud.run('getMetaMaskNonce', { publicAddress });
    const { signature } = await signMessage(response.nonce);
    const authData = {
      signature,
      id: publicAddress,
      method: 'web3',
    };
    const user = await Parse.User.logInWith('blockchainauth', { authData });
    dispatch(sessionsFetched({ session: user }));
    history.push('/');
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
};
