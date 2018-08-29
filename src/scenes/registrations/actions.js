import history from './../../main/history';
import * as analytics from 'libs/analytics';
import axios from 'axios';
import { serverBaseURL } from 'libs/config';

export const types = {
  REGISTRATION_SUCCESS: 'REGISTRATION_SUCCESS',
  REGISTRATION_FAILED: 'REGISTRATION_FAILED',
};

export const registrationSuccess = session => {
  return {
    type: this.types.REGISTRATION_SUCCESS,
    payload: session,
    meta: {
      analytics: [
        analytics.trackUserRegistered(session.session),
        analytics.identifyUsingSession(session.session),
      ],
    },
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
    axios.post(
      `${serverBaseURL}/users/signup`,
      { username: username, email: email, password: password },
    ).then(res => {
      dispatch(registrationSuccess({ session: res.data }));
      history.push('/login');
    }).catch(err => {
      dispatch(registrationFailed({ error: {message: err.response.data.description} }));
    });
  };
};
