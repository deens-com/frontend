import Parse from "parse";
import fetch_helpers from "./../../libs/fetch_helpers";

export const trip_fetched = trip => {
  return {
    type: "TRIP_FETCHED",
    payload: trip
  };
};

export const fetch_trip = (trip_id) => {
  return dispatch => {
    let query = fetch_helpers.build_query("Trip");
    query.equalTo("objectId", trip_id);
    query.find().then(
      response => {
        const json_trip = fetch_helpers.normalizeParseResponseData(response[0]);
        const trip = fetch_helpers.mapServiceObjects([json_trip]);
        dispatch(trip_fetched({ trip: trip[0] }));
      },
      error => {
        // TODO dispatch the error to error handler
        console.log(error);
      }
    );
  };
};
