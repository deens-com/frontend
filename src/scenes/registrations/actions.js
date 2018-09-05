import history from './../../main/history';
import * as analytics from 'libs/analytics';
import axios from 'libs/axios';
import { serverBaseURL } from 'libs/config';
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

export const postRegistration = (username, email, password) => {
  return dispatch => {
    axios
      .post(`${serverBaseURL}/users/signup`, {
        username: username,
        email: email,
        password: password,
      })
      .then(async res => {
        try {
          const auth0Response = await axios
            .post(`${serverBaseURL}/users/login`, { username: email, password: password })
            .catch(error => {
              dispatch(
                registrationFailed({ error: { message: error.response.data.error_description } }),
              );
            });
          if (auth0Response) {
            const auth0Token = auth0Response.data.access_token;
            const user = await axios
              .get(`${serverBaseURL}/users/me`, {
                headers: { Authorization: `Bearer ${auth0Token}` },
              })
              .catch(error => {
                dispatch(
                  registrationFailed({ error: { message: error.response.data.error_description } }),
                );
              });
            const userData = user.data;
            userData.accessToken = auth0Token;
            dispatch(registrationSuccess({ session: userData }));
            saveSession(userData);
            history.goBack();
          }
        } catch (error) {
          dispatch(registrationFailed({ error: { message: error } }));
        }
      })
      .catch(err => {
        dispatch(registrationFailed({ error: { message: err.response.data.message } }));
      });
  };
};
