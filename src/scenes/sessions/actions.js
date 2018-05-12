import Parse from "parse";
import history from "./../../main/history";
import { signMessage } from '../../libs/web3-utils';

export const types = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  LOGIN_ERROR: "LOGIN_ERROR"
};

export const sessionsFetched = session => {
  return {
    type: this.types.LOGIN_SUCCESS,
    payload: session
  };
};

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

export const loginWithMetamask = () => async dispatch => {
  try {
    const msg = 'please';
    const { publicAddress, signature } = await signMessage(msg);
    const authData = {
      signature,
      id: publicAddress,
      method: 'web3',
    };
    const user = await Parse.User.logInWith('blockchainauth', { authData });
    console.log('user', user);
    dispatch(sessionsFetched({ session: user }));
    history.push("/");
  } catch (error) {
    console.error(error);
    if (error.showToUser) {
      // TODO: @jaydp show some error to the user
    }
  }
};
