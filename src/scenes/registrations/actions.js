import * as analytics from 'libs/analytics';
import axios from 'libs/axios';
import Cookies from 'js-cookie';

export const types = {
  REGISTRATION_SUCCESS: 'REGISTRATION_SUCCESS',
  REGISTRATION_FAILED: 'REGISTRATION_FAILED',
  SET_LOADING: 'SET_LOADING',
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

export const setLoading = payload => {
  return {
    type: this.types.SET_LOADING,
    payload,
  };
};

export const postRegistration = (username, email, password, { from, action }) => async dispatch => {
  try {
    dispatch(setLoading(true));

    const cookieReferrerId = 'please_referrer_id';
    let referrer = Cookies.get(cookieReferrerId);

    await axios.post('/users/signup', {
      username: username,
      email: email,
      password: password,
      referrerCode: referrer,
    });

    dispatch(setLoading(false));
  } catch (error) {
    dispatch(
      registrationFailed({
        error: {
          message:
            (error.response &&
              error.response.data &&
              (error.response.data.message ||
                error.response.data.error_description ||
                error.response.data.description)) ||
            error.message,
        },
      }),
    );
    dispatch(setLoading(false));
  }
};
