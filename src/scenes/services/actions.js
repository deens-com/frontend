import Parse from 'parse';
import history from 'main/history';
import axios from 'libs/axios';
import fetch_helpers from './../../libs/fetch_helpers';
import { getSession } from './../../libs/user-session';

export const trips_fetched = trips => {
  return {
    type: 'TRIPS_FETCHED',
    payload: trips,
  };
};

export const tripCreated = trip => {
  return {
    type: 'TRIP_CREATED',
    payload: trip,
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

export const fetch_service = serviceId => async dispatch => {
  dispatch(serviceFetchStart());
  try {
    const service = await axios.get(`/services/${serviceId}?include=owner,tags`).catch(error => {
      dispatch({ type: 'SERVICE_FETCH_ERROR', payload: error });
    });
    if (service) {
      const serviceData = service.data;
      const formattedServiceData = fetch_helpers.buildServicesJson([serviceData])[0];
      const trips = await axios.get(`/trips/containing-service/${serviceId}`).catch(error => {
        dispatch({ type: 'SERVICE_FETCH_ERROR', payload: error });
      });
      if (trips) {
        const tripsData = trips.data;
        const formattedTripsData = fetch_helpers.buildServicesJson(tripsData);
        dispatch(trips_fetched({ trips: formattedTripsData }));
      }
      dispatch(service_fetched({ service: formattedServiceData }));
    }
  } catch (e) {
    dispatch({
      type: 'SERVICE_FETCH_ERROR',
      payload: e.response ? e.response.data : e,
    });
  }
};

export const fetchMyTrips = () => async (dispatch, getState) => {
  const state = getState();
  if (state.ServicesReducer.userUnpurchasedTrips.isLoading) return;
  dispatch(userUnpurchasedTripsFetchStart());
  try {
    const myTrips = await axios.get(`/trips?include=service`).catch(error => {
      dispatch({ type: 'SERVICE_FETCH_ERROR', payload: error });
    });
    if (myTrips) {
      const normalizedTrips = fetch_helpers.buildServicesJson(myTrips.data);
      const myUnpurchasedTrips = normalizedTrips.filter(trip => !trip.booked);
      dispatch(userUnpurchasedTripsFetchFinish(myUnpurchasedTrips));
    }
  } catch (error) {
    console.log(error);
  }
};

export const addServiceToTrip = ({ trip, day }) => async (dispatch, getState) => {
  const state = getState();
  const { service } = state.ServicesReducer;
  const tripServices = trip.services.concat([{ service: service._id, day: day }]);
  const updateParams = { services: tripServices };
  try {
    const updatedTrip = await axios.patch(`/trips/${trip._id}`, updateParams).catch(error => {
      console.log(error);
    });
    if (updatedTrip) {
      fetch_service(service._id)(dispatch);
      setAddedToTripMessage(trip)(dispatch);
    }
  } catch (error) {
    setAlreadyAddedToTrip(trip)(dispatch);
    console.error(error);
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
    const newTripTitle = { 'en-us': `Trip to ${service.location}` };
    const serviceGroup = {
      title: newTripTitle,
      description: { 'en-us': service.description },
      basePrice: service.basePrice,
      baseCurrency: service.baseCurrency,
      services: [{ service: service, day: 1 }],
      duration: service.duration,
    };
    const newTrip = await axios.post(`/trips`, serviceGroup).catch(error => {
      console.log(error);
    });
    if (newTrip) {
      const formattedTrip = fetch_helpers.buildServicesJson([newTrip.data])[0];
      setAddedToTripMessage(formattedTrip)(dispatch);
      dispatch(tripCreated({ trip: formattedTrip }));
      if (redirectToCreatedTrip) {
        history.push(`/trips/${newTrip.data._id}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const onBookNowClick = () => async (dispatch, getState) => {
  const user = getSession();
  if (user) {
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
};

export const setAlreadyAddedToTrip = trip => dispatch => {
  dispatch({ type: 'SERVICE_ALREADY_ADDED_TO_TRIP', payload: trip });
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
