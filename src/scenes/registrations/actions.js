import Parse from 'parse';
import history from './../../main/history';

export const types = {
  REGISTRATION_SUCCESS: 'REGISTRATION_SUCCESS',
  REGISTRATION_FAILED: 'REGISTRATION_FAILED',
};

export const registrationSuccess = session => {
  return {
    type: this.types.REGISTRATION_SUCCESS,
    payload: session,
  };
};

export const registrationFailed = error_payload => {
  return {
    type: this.types.REGISTRATION_FAILED,
    payload: error_payload,
  };
};

export const postRegistration = (username, email, password) => {
  return dispatch => {
    let user = new Parse.User();
    user.set('username', username);
    user.set('email', email);
    user.set('password', password);
    user.signUp(null, {
      success: user => {
        dispatch(registrationSuccess({ session: user }));
        history.push('/');
      },
      error: (user, error) => {
        dispatch(registrationFailed({ user: user, error: error }));
      },
    });
  };
};
