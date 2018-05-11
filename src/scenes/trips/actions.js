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

      formatted_trip.organization = [];

      let trip_org_query = fetch_helpers.build_query("TripOrganization");
      trip_org_query.include("trip");
      trip_org_query.include("service");
      trip_org_query.equalTo("trip", trip);
      trip_org_query.find().then(trip_orgs => {
        const json_trip_org = fetch_helpers.normalizeParseResponseData(trip_orgs);

        let trip_organization = [];

        json_trip_org.forEach(trip_org => {
          let t_o_service = trip_org.service;
          t_o_service.position = trip_org.position;
          let trip_item = {
            day: trip_org.day,
            service: t_o_service
          }
          trip_organization = trip_organization.concat(trip_item);
        })

        trip_organization.sort((a,b) => a.day - b.day);
        trip_organization = groupBy(trip_organization, (t_o) => t_o.day);
        trip_organization = Object.values(trip_organization);

        trip_organization = trip_organization.map((t_o) => {
          const day = t_o[0].day;
          const services = t_o.map(item => item.service);
          return {
            day: day,
            services: services
          }
        })
        //console.log(trip_organization);
        formatted_trip.organization = trip_organization;

        dispatch(trip_fetched({ trip: formatted_trip }));
      })

    })

  };
};

/* https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_groupby */
function groupBy(xs, f) {
  return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}
