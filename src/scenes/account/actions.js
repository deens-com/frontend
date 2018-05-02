import Parse from "parse";
import fetch_helpers from "./../../libs/fetch_helpers";
import history from "./../../main/history";

export const user_profile_fetched = user_profile => {
  return {
    type: "USER_PROFILE_FETCHED",
    payload: user_profile
  };
};


export const fetch_user_profile = () => dispatch => {
  const user = Parse.User.current();
  if(user === null){
    history.push("/login")
  }else{
    const json_user = fetch_helpers.normalizeParseResponseData(user);
    dispatch(user_profile_fetched({user_profile: json_user}));
  }
};
