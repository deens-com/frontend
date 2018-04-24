import Parse from "parse";
import fetch_helpers from "./../../libs/fetch_helpers";

export const trips_fetched = trips => {
  return {
    type: "TRIPS_FETCHED",
    payload: trips
  };
};

export const service_fetched = service => {
  return {
    type: "SERVICE_FETCHED",
    payload: service
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
        const trips = fetch_helpers.normalizeParseResponseData(response);
        dispatch(trips_fetched({ trips: trips }));
      },
      error => {
        // TODO dispatch the error to error handler
        console.log(error);
      }
    );
  };
};

export const fetch_service = (service_id) => {
  return dispatch => {
    let Service = Parse.Object.extend("Service");
    let query = new Parse.Query(Service);
    query.equalTo("objectId", service_id);
    query.find().then(
      response => {
        const json_service = fetch_helpers.normalizeParseResponseData(response);
        const serialized_services = fetch_helpers.mapServiceObjects(json_service);
        dispatch(service_fetched({ service: serialized_services[0] }));
      },
      error => {
        // TODO dispatch the error to error handler
        console.log(error);
      }
    );
  };
};
