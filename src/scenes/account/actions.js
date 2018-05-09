import Parse from "parse";
import fetch_helpers from "./../../libs/fetch_helpers";
import history from "./../../main/history";

export const user_profile_fetched = user_profile => {
  return {
    type: "USER_PROFILE_FETCHED",
    payload: user_profile
  };
};


export const planned_trips_fetched = planned_trips => {
  return {
    type: "PLANNED_TRIPS_FETCHED",
    payload: planned_trips
  };
};


export const completed_trips_fetched = completed_trips => {
  return {
    type: "COMPLETED_TRIPS_FETCHED",
    payload: completed_trips
  };
};


export const fetch_user_profile = () => dispatch => {
  let user = Parse.User.current();
  if(user === null){
    history.push("/login")
  }else{
    Parse.User.current().fetch().then(response => {
      const json_response = fetch_helpers.normalizeParseResponseData(response);
      user = json_response;
      if(user === null){
        history.push("/login")
      }else{
        const json_user = fetch_helpers.normalizeParseResponseData(user);
        dispatch(user_profile_fetched({user_profile: json_user}));
      }
    }).catch(error => {
      console.log(error);
    });
  }
};


export const fetch_planned_trips = (owner_id) => {
  return dispatch => {
    let user_query = fetch_helpers.build_query("User");
    user_query.equalTo("objectId", owner_id)
    user_query.first().then(user => {
      let trip_query = fetch_helpers.build_query("Trip");
      trip_query.equalTo("owner", user);
      const moment_now = new Date();
      trip_query.greaterThan("beginDate", moment_now);
      trip_query.find().then(
        trips_response => {
          trips_response.map(trip => {
            let trip_org_query = fetch_helpers.build_query("TripOrganization");
            trip_org_query.include("service");
            trip_org_query.equalTo("trip", trip);
            const json_trip = fetch_helpers.normalizeParseResponseData([trip]);
            const formatted_trip = fetch_helpers.mapServiceObjects(json_trip)[0];
            formatted_trip.services = [];
            trip_org_query.find().then(trip_org => {
              const json_trip_org = fetch_helpers.normalizeParseResponseData(trip_org);
              if(json_trip_org.length){
                json_trip_org.forEach(t_o => {
                  const t_o_service = fetch_helpers.normalizeParseResponseData(t_o.service);
                  const formatted_service = fetch_helpers.mapServiceObjects([t_o_service])[0];
                  formatted_trip.services = formatted_trip.services.concat(formatted_service);
                })
              }
              dispatch(planned_trips_fetched({ planned_trips: formatted_trip }));
            })
          })
        },
        error => {
          // TODO dispatch the error to error handler
          console.log(error);
        }
      );
    })
  };
};
