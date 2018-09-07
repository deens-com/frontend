import history from './../../main/history';
import * as analytics from 'libs/analytics';
import axios from 'libs/axios';
import { saveSession } from 'libs/user-session';

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

export const postRegistration = (username, email, password) => async dispatch => {
  try {
    await axios.post('/users/signup', {
      username: username,
      email: email,
      password: password,
    });
    const loginResponse = await axios.post('/users/login', { username: email, password: password });
    const auth0Token = loginResponse.data.access_token;
    const user = await axios.get('/users/me', {
      headers: { Authorization: `Bearer ${auth0Token}` },
    });
    const userData = user.data;
    userData.accessToken = auth0Token;
    dispatch(registrationSuccess({ session: userData }));
    saveSession(userData);
    history.goBack();
  } catch (error) {
    console.error(error);
    console.log(error.response);
    dispatch(
      registrationFailed({
        error: {
          message:
            (error.response &&
              error.response.data &&
              (error.response.data.error_description || error.response.data.description)) ||
            error.message,
        },
      }),
    );
  }
};
