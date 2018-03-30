import Parse from "parse";

export const trips_fetched = trips => {
  return {
    type: "TRIPS_FETCHED",
    payload: trips
  };
};

const json_response = data => {
  let dataInJsonString = JSON.stringify(data);
  return JSON.parse(dataInJsonString);
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
        const trips = json_response(response);
        dispatch(trips_fetched({ trips: trips }));
      },
      error => {
        // TODO dispatch the error to error handler
        console.log(error);
      }
    );
  };
};
