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

export const current_user_fetched = user => {
  return {
    type: "CURRENT_USER_FETCHED",
    payload: user
  };
};


export const fetch_current_user = (user_id) => {
  return dispatch => {
    let user_query = fetch_helpers.build_query("User");
    user_query.equalTo("objectId", user_id);
    user_query.find().then(response => {
      const json_user = fetch_helpers.normalizeParseResponseData(response[0]);
      const current_user = fetch_helpers.mapServiceObjects([json_user]);
      dispatch(current_user_fetched({ current_user: current_user[0] }));
    })
  };
};
