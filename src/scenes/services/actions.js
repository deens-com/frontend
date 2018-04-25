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

export const fetch_trips = (service_id) => {
  return dispatch => {
    let query = fetch_helpers.build_query("TripOrganization");
    let service_query = fetch_helpers.build_query("Service");
    service_query.equalTo("objectId", service_id);
    service_query.find().then(res => {
      query.include("trip");
      query.equalTo("service", res[0]);
      query.find().then(
        response => {
          const trips_organization = fetch_helpers.normalizeParseResponseData(response);
          const trips = trips_organization.map(trip_org => {
            return trip_org.trip;
          })
          const serialized_trips = fetch_helpers.mapServiceObjects(trips);
          dispatch(trips_fetched({ trips: serialized_trips }));
        },
        error => {
          // TODO dispatch the error to error handler
          console.log(error);
        }
      );
    })

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
