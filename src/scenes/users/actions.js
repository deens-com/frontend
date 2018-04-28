import Parse from "parse";
import fetch_helpers from "./../../libs/fetch_helpers";

export const trips_fetched = trips => {
  return {
    type: "TRIPS_FETCHED",
    payload: trips
  };
};

export const given_reviews_fetched = given_reviews => {
  return {
    type: "GIVEN_REVIEWS_FETCHED",
    payload: given_reviews
  };
};

export const received_reviews_fetched = received_reviews => {
  return {
    type: "RECEIVED_REVIEWS_FETCHED",
    payload: received_reviews
  };
};

export const userFetched = user => ({ type: 'USER_FETCHED', payload: user });

export const fetchUser = userName => dispatch => {
  const query = fetch_helpers.build_query('User').equalTo('username', userName);
  query.first().then(user => {
    if (user) {
      const normalizedData = fetch_helpers.normalizeParseResponseData(user);
      dispatch(userFetched(normalizedData));
    } else {
      console.error(`user: ${userName} not found!`);
    }
  });
};
