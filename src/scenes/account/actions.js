import Parse from "parse";
import fetch_helpers from "./../../libs/fetch_helpers";

export const user_profile_fetched = user_profile => {
  return {
    type: "USER_PROFILE_FETCHED",
    payload: user_profile
  };
};


export const fetch_user_profile = userName => dispatch => {
  // Todo
};
