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

    let trip_query = fetch_helpers.build_query("Trip");
    trip_query.equalTo("objectId", trip_id);
    trip_query.first().then(trip => {

      const json_trip = fetch_helpers.normalizeParseResponseData(trip);
      let formatted_trip = fetch_helpers.mapServiceObjects([json_trip])[0];
      //formatted_trip.services = [];


      formatted_trip.organization = [];

      let trip_org_query = fetch_helpers.build_query("TripOrganization");
      trip_org_query.include("trip");
      trip_org_query.include("service");
      trip_org_query.equalTo("trip", trip);
      trip_org_query.find().then(trip_orgs => {
        const json_trip_org = fetch_helpers.normalizeParseResponseData(trip_orgs);

        let trip_organization = [];

        json_trip_org.forEach(trip_org => {
          //formatted_trip.services = formatted_trip.services.concat(trip_org.service);
          let trip_item = {
            day: trip_org.day,
            position: trip_org.position,
            service: trip_org.service
          }
          trip_organization = trip_organization.concat(trip_item);
          //formatted_trip.organization = formatted_trip.organization.concat(trip_item);
        })

        console.log(trip_organization);
        
        dispatch(trip_fetched({ trip: formatted_trip }));
      })

    })

  };
};
