import Parse from "parse";

export const types = {
  SESSION_FETCHED: "SESSION_FETCHED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  LOGIN_ERROR: "LOGIN_ERROR"
};

export const sessionsFetched = session => {
  return {
    type: this.types.SESSION_FETCHED,
    payload: session
  };
};

export const loginRequest = (email, password) => {
  return dispatch => {
    Parse.User.logIn(email, password).then(
      user => {
        dispatch(sessionsFetched({ session: user }));
      },
      error => {
        dispatch({
          type: types.LOGIN_ERROR,
          payload: error
        });
      }
    );
  };
};
