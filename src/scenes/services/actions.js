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
    let query = fetch_helpers.build_query("Service");
    query.equalTo("objectId", service_id);
    query.find().then(
      response => {
        const json_service = fetch_helpers.normalizeParseResponseData(response);
        const serialized_services = fetch_helpers.mapServiceObjects(json_service);

        let pics_query = fetch_helpers.build_query("ServicePicture");
        pics_query.equalTo("service", response[0]);

        pics_query.find().then(service_pictures => {
          const service_pics = fetch_helpers.normalizeParseResponseData(service_pictures);
          const pics = service_pics.map(sp => sp.picture);

          let service_with_pictures = serialized_services[0];
          service_with_pictures.pictures = pics;

          dispatch(service_fetched({ service: service_with_pictures }));
        });
      },
      error => {
        // TODO dispatch the error to error handler
        console.log(error);
      }
    );
  };
};
