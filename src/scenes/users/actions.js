import axios from 'libs/axios';
import { serverBaseURL } from 'libs/config';

export const trips_fetched = trips => {
  return {
    type: 'TRIPS_FETCHED',
    payload: trips,
  };
};

export const given_reviews_fetched = given_reviews => {
  return {
    type: 'GIVEN_REVIEWS_FETCHED',
    payload: given_reviews,
  };
};

export const received_reviews_fetched = received_reviews => {
  return {
    type: 'RECEIVED_REVIEWS_FETCHED',
    payload: received_reviews,
  };
};

export const fullUserFetchStarted = () => ({ type: 'FULL_USER_FETCH_START' });
export const fullUserFetched = user => ({ type: 'FULL_USER_FETCHED', payload: user });
export const fullUserFetchError = ({ code, message }) => ({
  type: 'FULL_USER_FETCH_ERROR',
  payload: { code, message },
});

export const fetchFullUser = username => async dispatch => {
  dispatch(fullUserFetchStarted());
  try {
    const responseData = await axios.get(`${serverBaseURL}/users/${username}`);
    dispatch(fullUserFetched(responseData));
  } catch (e) {
    dispatch(fullUserFetchError(e));
  }
};
