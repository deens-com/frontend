import Parse from "parse";
import history from "./../../main/history";

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
