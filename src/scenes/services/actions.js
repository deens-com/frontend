import Parse from "parse";
import fetch_helpers from "./../../libs/fetch_helpers";

export const trips_fetched = trips => {
  return {
    type: "TRIPS_FETCHED",
    payload: trips
  };
};

export const reviews_fetched = reviews => {
  return {
    type: "REVIEWS_FETCHED",
    payload: reviews
  };
};

export const service_fetched = service => {
  return {
    type: "SERVICE_FETCHED",
    payload: service
  };
};

export const userTripsFetchStart = () => ({ type: 'USER_TRIPS_FETCH' });
export const userTripsFetchFinish = trips => ({ type: 'USER_TRIPS_FETCH_FINISH', payload: trips });

export const fetch_service = (service_id) => {
  return dispatch => {
    let query = fetch_helpers.build_query("Service");
    query.equalTo("objectId", service_id);
    query.include('owner');
    query.find().then(
      response => {

        // Associated Trips
        let trip_org_query = fetch_helpers.build_query("TripOrganization");
        trip_org_query.include("trip");
        trip_org_query.equalTo("service", response[0]);
        trip_org_query.find().then(
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

        // Associated Reviews
        let reviews_query = fetch_helpers.build_query("Review");
        reviews_query.include("reviewer");
        reviews_query.equalTo("service", response[0]);
        reviews_query.find().then(
          response => {
            const reviews = fetch_helpers.normalizeParseResponseData(response);
            const serialized_reviews = reviews.map(review => {
              delete(review.service);
              return review;
            })
            dispatch(reviews_fetched({ reviews: serialized_reviews }));
          },
          error => {
            // TODO dispatch the error to error handler
            console.log(error);
          }
        );

        const json_service = fetch_helpers.normalizeParseResponseData(response);
        const serialized_services = fetch_helpers.mapServiceObjects(json_service);

        // Associated Pictures
        let pics_query = fetch_helpers.build_query("ServicePicture");
        pics_query.equalTo("service", response[0]);

        pics_query.find().then(service_pictures => {
          const service_pics = fetch_helpers.normalizeParseResponseData(service_pictures);
          let pics = service_pics.map(sp => sp.picture);
          pics.unshift(serialized_services[0].mainPicture);
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


export const fetchMyTrips = () => async (dispatch, getState) => {
  const state = getState();
  if (state.ServicesReducer.userTrips.isLoading) return;
  dispatch(userTripsFetchStart());
  const trips = await Parse.Cloud.run('getMyTrips');
  const normalizedTrips = fetch_helpers.normalizeParseResponseData(trips);
  dispatch(userTripsFetchFinish(normalizedTrips));
};

export const addServiceToTrip = trip => async (dispatch, getState) => {
  const state = getState();
  const { service } = state.ServicesReducer;
  try {
    await Parse.Cloud.run('addServiceToTrip', { serviceId: service.objectId, tripId: trip.objectId });
    alert(`Service added in ${trip.title}`);
  } catch (error) {
    console.error(error);
    if (error.code === 141) {
      // parse error
      alert(error.message.message);
    }
  }
};
