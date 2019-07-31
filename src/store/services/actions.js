import history from 'main/history';
import axios from 'libs/axios';
import fetch_helpers, { parseTags } from 'libs/fetch_helpers';
import * as tripUtils from 'libs/trips';
import urls from 'libs/urlGenerator';
import { getCurrentUserTrip } from 'store/session/actions';
import moment from 'moment';
import apiClient from 'libs/apiClient';

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
    const service = await axios.get(`/services/${serviceId}?include=owner,tags`);
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

      dispatch(
        service_fetched({
          service: {
            ...formattedServiceData,
            tags: parseTags(serviceData.tags),
          },
        }),
      );
    }
  } catch (e) {
    console.log(e);
    dispatch({
      type: 'SERVICE_FETCH_ERROR',
      payload: e.response ? e.response.data : e,
    });
  }
};

const addServiceToTrip = ({ trip, day }) => async (dispatch, getState) => {
  const state = getState();
  const { service } = state.services;

  try {
    dispatch({
      type: 'TRIP_UPDATING',
    });

    const updatedTrip = await tripUtils.addServiceRequest(trip._id, day, service._id);
    if (updatedTrip.status === 200) {
      fetch_service(service._id)(dispatch);
      setAddedToTripMessage(trip)(dispatch);
    }

    dispatch({
      type: 'TRIP_UPDATED',
    });
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
    const newTripTitle = { en: `Trip to ${service.location}` };
    const startDate = state.search.searchQuery.startDate || moment().toJSON();
    const endDate =
      state.search.searchQuery.endDate ||
      moment()
        .add(1, 'days')
        .toJSON();
    const days = moment(endDate).diff(moment(startDate), 'days');
    const duration = days * 60 * 24;
    const serviceGroup = {
      title: newTripTitle,
      ...(service.description && { description: { en: service.description } }),
      baseCurrency: service.baseCurrency,
      services: [...new Array(days)].map((_, i) => ({ service: service._id, day: i + 1 })),
      duration,
      location: service.originalLocation,
      userStartLocation: service.originalLocation,
      userEndLocation: service.originalLocation,
      adultCount: Number(state.search.searchQuery.adults) || 2,
      childrenCount: Number(state.search.searchQuery.children) || 0,
      infantCount: Number(state.search.searchQuery.infants) || 0,
      startDate,
      endDate,
    };
    dispatch({
      type: 'TRIP_CREATING',
    });
    const newTrip = await apiClient.trips.post(serviceGroup);
    dispatch(getCurrentUserTrip());
    if (newTrip) {
      const formattedTrip = fetch_helpers.buildServicesJson([newTrip.data])[0];
      setAddedToTripMessage(formattedTrip)(dispatch);
      dispatch(tripCreated({ trip: formattedTrip }));
      if (redirectToCreatedTrip) {
        history.push(urls.trip.checkout(newTrip.data._id));
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
