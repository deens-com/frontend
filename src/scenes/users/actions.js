import Parse from 'parse';
import fetch_helpers from './../../libs/fetch_helpers';

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

export const fullUserFetched = user => ({ type: 'FULL_USER_FETCHED', payload: user });

export const fetchFullUser = userName => dispatch => {
  Parse.Cloud.run('fetch_profile_data', { userName }).then(response => {
    dispatch(fullUserFetched(response));
  });
};
