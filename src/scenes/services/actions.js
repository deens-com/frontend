import Parse from 'parse';
import fetch_helpers from './../../libs/fetch_helpers';
import history from 'main/history';
import { trackTripCreated } from 'libs/analytics';

export const trips_fetched = trips => {
  return {
    type: 'TRIPS_FETCHED',
    payload: trips,
  };
};

export const reviews_fetched = reviews => {
  return {
    type: 'REVIEWS_FETCHED',
    payload: reviews,
  };
};

export const serviceFetchStart = () => ({ type: 'SERVICE_FETCH_START' });
export const service_fetched = service => {
  return {
    type: 'SERVICE_FETCHED',
    payload: service,
  };
};

export const set_service_unavailability_modal = bool => {
  return {
    type: 'SERVICE_UNAVAILABILITY_MODAL_SET',
    payload: bool,
  };
};

export const userUnpurchasedTripsFetchStart = () => ({ type: 'USER_UNPURCHASED_TRIPS_FETCH' });
export const userUnpurchasedTripsFetchFinish = trips => ({
  type: 'USER_UNPURCHASED_TRIPS_FETCH_FINISH',
  payload: trips,
});

export const fetch_service = service_id => dispatch => {
  dispatch(serviceFetchStart());
  let query = fetch_helpers.build_query('Service');
  query.equalTo('objectId', service_id);
  query.include('owner');
  query.find().then(
    response => {
      // Associated Trips
      let trip_org_query = fetch_helpers.build_query('TripOrganization');
      trip_org_query.include('trip');
      trip_org_query.equalTo('service', response[0]);
      trip_org_query.find().then(
        response => {
          const trips_organization = fetch_helpers.normalizeParseResponseData(response);
          const tripsMap = trips_organization.reduce((tripsMap, tripOrg) => {
            if (tripOrg.trip) tripsMap[tripOrg.trip.objectId] = tripOrg.trip;
            return tripsMap;
          }, {});
          const trips = Object.values(tripsMap);
          const serialized_trips = fetch_helpers.mapServiceObjects(trips);
          dispatch(trips_fetched({ trips: serialized_trips }));
        },
        error => {
          // TODO dispatch the error to error handler
          console.log(error);
        },
      );

      // Associated Reviews
      let reviews_query = fetch_helpers.build_query('Review');
      reviews_query.include('reviewer');
      reviews_query.equalTo('service', response[0]);
      reviews_query.find().then(
        response => {
          const reviews = fetch_helpers.normalizeParseResponseData(response);
          const serialized_reviews = reviews.map(review => {
            delete review.service;
            return review;
          });
          dispatch(reviews_fetched({ reviews: serialized_reviews }));
        },
        error => {
          // TODO dispatch the error to error handler
          console.log(error);
        },
      );

      const json_service = fetch_helpers.normalizeParseResponseData(response);
      const serialized_services = fetch_helpers.mapServiceObjects(json_service);

      // Associated Pictures
      let pics_query = fetch_helpers.build_query('ServicePicture');
      pics_query.equalTo('service', response[0]);

      pics_query.find().then(service_pictures => {
        const service_pics = fetch_helpers.normalizeParseResponseData(service_pictures);
        let pics = service_pics.map(sp => sp.picture);
        pics.unshift(serialized_services[0].media && serialized_services[0].media[0]);
        let service_with_pictures = serialized_services[0];
        service_with_pictures.pictures = pics;
        dispatch(service_fetched({ service: service_with_pictures }));
      });
    },
    error => {
      // TODO dispatch the error to error handler
      console.log(error);
      dispatch({ type: 'SERVICE_FETCH_ERROR', payload: error });
    },
  );
};

export const fetchMyTrips = () => async (dispatch, getState) => {
  const state = getState();
  if (state.ServicesReducer.userUnpurchasedTrips.isLoading) return;
  dispatch(userUnpurchasedTripsFetchStart());
  const trips = await Parse.Cloud.run('getMyNonPurchasedTrips');
  const normalizedTrips = fetch_helpers.normalizeParseResponseData(trips);
  dispatch(userUnpurchasedTripsFetchFinish(normalizedTrips));
};

export const addServiceToTrip = ({ trip, day }) => async (dispatch, getState) => {
  const state = getState();
  const { service } = state.ServicesReducer;
  try {
    await Parse.Cloud.run('addServiceToTrip', {
      serviceId: service.objectId,
      tripId: trip.objectId,
      day,
    });
    fetch_service(service.objectId)(dispatch);
    setAddedToTripMessage(trip)(dispatch);
  } catch (error) {
    console.error(error);
    if (error.code === 141) {
      // parse error
      console.error('error running parse function', error.message.message);
      if (error.message && error.message.message.includes('already added')) {
        setAlreadyAddedToTrip(trip)(dispatch);
      }
    }
  }
};

export const createNewTrip = ({ redirectToCreatedTrip } = {}) => async (dispatch, getState) => {
  const state = getState();
  const { service } = state.ServicesReducer;
  if (!service) {
    console.error('No service found');
    return;
  }

  try {
    const newTripTitle = `Trip to ${service.country}`;
    const { trip } = await Parse.Cloud.run('addServiceToNewTrip', {
      serviceId: service.objectId,
      tripTitle: newTripTitle,
    });
    fetch_service(service.objectId)(dispatch);
    fetchMyTrips()(dispatch, getState);
    dispatch({ type: 'analytics', meta: { analytics: trackTripCreated(trip) } });
    if (redirectToCreatedTrip) {
      history.push(`/trips/${trip.objectId}`);
    } else {
      setAddedToTripMessage(trip)(dispatch);
    }
  } catch (error) {
    console.error(error);
    if (error.code === 141) {
      // parse error
      console.error('error running parse function', error.message.message);
    }
  }
};

export const onBookNowClick = () => async (dispatch, getState) => {
  if (Parse.User.current()) {
    createNewTrip({ redirectToCreatedTrip: true })(dispatch, getState);
  } else {
    history.push('/login');
  }
};

/**
 * Shows "Service added to X trip" for 3 seconds
 */
export const setAddedToTripMessage = trip => dispatch => {
  dispatch({ type: 'SERVICE_RECENTLY_ADDED_TO_TRIP', payload: trip });
  setTimeout(() => dispatch({ type: 'SERVICE_RECENTLY_ADDED_TO_TRIP', payload: undefined }), 10000); // 10 s
};

export const setAlreadyAddedToTrip = trip => dispatch => {
  dispatch({ type: 'SERVICE_ALREADY_ADDED_TO_TRIP', payload: trip });
  setTimeout(() => dispatch({ type: 'SERVICE_ALREADY_ADDED_TO_TRIP', payload: undefined }), 10000); // 10 s
};

export const toggleServiceAvailabilitymodal = bool => {
  return dispatch => {
    dispatch(set_service_unavailability_modal(false));
  };
};

export const checkAvailability = (serviceId, slotsNb) => {
  return dispatch => {
    let service_availability_query = fetch_helpers.build_query('Service').get(serviceId);
    service_availability_query.then(response => {
      const json_service = fetch_helpers.normalizeParseResponseData(response);
      const serialized_service = fetch_helpers.mapServiceObjects([json_service])[0];
      const service_slots = serialized_service.slots;
      if (service_slots < slotsNb) {
        dispatch(set_service_unavailability_modal(true));
      } else {
        dispatch(set_service_unavailability_modal(false));
      }
    });
  };
};

export const fetchServiceContractABI = () => async dispatch => {
  const result = await Parse.Cloud.run('getLastContract');
  dispatch({ type: 'SERVICE_CONTRACT_ABI', payload: result });
};

export const resetServiceData = () => async dispatch => {
  dispatch({ type: 'SERVICE/RESET' });
};
