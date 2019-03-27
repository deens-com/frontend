import history from 'main/history';
import axios from 'libs/axios';
import fetch_helpers from 'libs/fetch_helpers';
import { loadTrip, saveTrip } from 'libs/localStorage';
import * as tripUtils from 'libs/trips';

const trips_fetched = trips => {
  return {
    type: 'TRIPS_FETCHED',
    payload: trips,
  };
};

const tripCreated = trip => {
  return {
    type: 'TRIP_CREATED',
    payload: trip,
  };
};

const reviews_fetched = reviews => {
  return {
    type: 'REVIEWS_FETCHED',
    payload: reviews,
  };
};

const serviceFetchStart = () => ({ type: 'SERVICE_FETCH_START' });
const service_fetched = service => {
  return {
    type: 'SERVICE_FETCHED',
    payload: service,
  };
};

const set_service_unavailability_modal = bool => {
  return {
    type: 'SERVICE_UNAVAILABILITY_MODAL_SET',
    payload: bool,
  };
};

const fetch_service = serviceId => async dispatch => {
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

const addServiceToTrip = ({ trip, day }, loggedIn = true) => async (dispatch, getState) => {
  const state = getState();
  const { service } = state.services;
  const serviceToAdd = loggedIn ? service._id : service;

  if (!loggedIn) {
    const currentTrip = loadTrip();
    const tripServices = tripUtils.addServiceToTrip(currentTrip.services, serviceToAdd, day);
    const newTrip = {
      ...currentTrip,
      services: tripServices,
    };
    saveTrip(newTrip);
    setAddedToTripMessage(newTrip)(dispatch);
    return;
  }

  try {
    dispatch({
      type: 'TRIP_UPDATING',
    });

    const updatedTrip = await tripUtils.addServiceRequest(trip._id, day, service._id);

    if (updatedTrip.data && updatedTrip.data.success) {
      fetch_service(service._id)(dispatch);
      setAddedToTripMessage(trip)(dispatch);
    }
  } catch (error) {
    console.error(error);
  }
};

const createNewTrip = ({ redirectToCreatedTrip } = {}) => async (dispatch, getState) => {
  const state = getState();
  const { service } = state.services;
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
      services: [{ service: service._id, day: 1 }],
      duration: service.duration,
    };
    dispatch({
      type: 'TRIP_CREATING',
    });
    const newTrip = await axios.post(`/trips`, serviceGroup);
    if (newTrip) {
      const formattedTrip = fetch_helpers.buildServicesJson([newTrip.data])[0];
      setAddedToTripMessage(formattedTrip)(dispatch);
      dispatch(tripCreated({ trip: formattedTrip }));
      if (redirectToCreatedTrip) {
        history.push(`/trips/organize/${newTrip.data._id}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const onBookNowClick = () => async (dispatch, getState) => {
  createNewTrip({ redirectToCreatedTrip: true })(dispatch, getState);
};

/**
 * Shows "Service added to X trip" for 3 seconds
 */
const setAddedToTripMessage = trip => dispatch => {
  dispatch({ type: 'SERVICE_RECENTLY_ADDED_TO_TRIP', payload: trip });
};

const toggleServiceAvailabilitymodal = bool => {
  return dispatch => {
    dispatch(set_service_unavailability_modal(false));
  };
};

const checkAvailability = (serviceId, slotsNb) => {
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

export const resetServiceData = () => async dispatch => {
  dispatch({ type: 'SERVICE/RESET' });
};

export default {
  fetch_service,
  addServiceToTrip,
  createNewTrip,
  onBookNowClick,
  setAddedToTripMessage,
  toggleServiceAvailabilitymodal,
  checkAvailability,
  resetServiceData,
};
