import Parse from "parse";

import fetch_helpers from "./../../libs/fetch_helpers";


export const trip_fetched = trip => {
  return {
    type: "TRIP_FETCHED",
    payload: trip
  };
};

export const fetch_trips = () => {
  return dispatch => {
    let Trip = Parse.Object.extend("Trip");
    let query = new Parse.Query(Trip);
    query.equalTo("type", "activity");
    query.descending("createdAt");
    query.limit(10);
    query.find().then(
      response => {
        const json_trip = fetch_helpers.normalizeParseResponseData(response[0]);
        const trip = fetch_helpers.mapServiceObjects(json_trip);
        dispatch(trip_fetched({ trip: trip }));
      },
      error => {
        // TODO dispatch the error to error handler
        console.log(error);
      }
    );
  };
};
