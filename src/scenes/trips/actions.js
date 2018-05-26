import Parse from 'parse';
import fetch_helpers from './../../libs/fetch_helpers';

export const trip_fetched = trip => ({
  type: 'TRIP_FETCHED',
  payload: trip,
});

export const tripFetchError = error => ({ type: 'TRIP_FETCH_ERROR', payload: error });

export const tripChangeServiceDay = (tripOrganizationId, newDay) => ({
  type: 'CHANGE_SERVICE_DAY',
  payload: { tripOrganizationId, newDay },
});

export const removeService = tripOrganizationId => ({
  type: 'REMOVE_SERVICE_TRIP',
  payload: tripOrganizationId,
});

export const tripUpdated = value => ({ type: 'TRIP_UPDATED', payload: value });

export const serviceAvailabilities = obj => ({ type: 'SERVICE_AVAILIBILITIES', payload: obj });

export const fetchTrip = tripId => async (dispatch, getState) => {
  if (!tripId) {
    console.error(new Error("can't fetch trip without TripId"));
    return;
  }

  const Trip = Parse.Object.extend('Trip');
  try {
    const [tripRaw, tripOrganizationsRaw] = await Promise.all([
      fetch_helpers.build_query('Trip').get(tripId),
      fetch_helpers
        .build_query('TripOrganization')
        .equalTo('trip', new Trip({ id: tripId }))
        .include('service')
        .find(),
    ]);
    let trip = fetch_helpers.normalizeParseResponseData(tripRaw);
    trip = fetch_helpers.mapServiceObjects([trip])[0];
    const tripOrganizations = fetch_helpers.normalizeParseResponseData(tripOrganizationsRaw);
    const tripOrganizationMappings = tripOrganizations.map(tOrg => ({
      objectId: tOrg.objectId,
      tripId: tOrg.trip.objectId,
      serviceId: tOrg.service.objectId,
      day: tOrg.day,
    }));
    const services = tripOrganizations.map(tOrg => tOrg.service);
    dispatch(trip_fetched({ trip, tripOrganizations: tripOrganizationMappings, services }));
    checkAvailibility(new Date())(dispatch, getState);
  } catch (error) {
    console.error(error);
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) dispatch(tripFetchError(error));
  }
};

export const changeServiceDay = (tripOrganizationId, newDay) => async (dispatch, getState) => {
  if (!tripOrganizationId) {
    console.error(new Error("can't update service day without tripOrganizationId"));
  }
  dispatch(tripChangeServiceDay(tripOrganizationId, newDay));
  const tripOrganization = await fetch_helpers.build_query('TripOrganization').get(tripOrganizationId);
  if (newDay === 'null') {
    tripOrganization.unset('day');
  } else {
    tripOrganization.set('day', parseInt(newDay, 10));
  }
  await tripOrganization.save();
  // re-fetch trip in case anything else has changed
  fetchTrip(tripOrganization.get('trip').id)(dispatch, getState);
};

export const removeServiceFromTrip = tripOrganizationId => async dispatch => {
  if (!tripOrganizationId) return;
  dispatch(removeService(tripOrganizationId));
  const tripOrganization = await fetch_helpers.build_query('TripOrganization').get(tripOrganizationId);
  tripOrganization.destroy();
};

export const updateTrip = (newDetails, showSaved) => async (dispatch, getState) => {
  if (!newDetails) return;
  if (Object.keys(newDetails).length === 0) return;
  const state = getState();
  const tripId = state.TripsReducer.trip.objectId;
  await Parse.Cloud.run('updateTripDetails', { tripId, ...newDetails });
  if (showSaved) {
    dispatch(tripUpdated(true));
    setTimeout(() => dispatch(tripUpdated(false)), 3000);
  }
  fetchTrip(tripId)(dispatch);
};

export const checkAvailibility = startDate => async (dispatch, getState) => {
  if (!startDate) return;
  const state = getState();
  const tripId = state.TripsReducer.trip.objectId;
  const result = await Parse.Cloud.run('checkAvailibilityByTrip', { tripId, startDate });
  dispatch(serviceAvailabilities(result));
};

export const setShowTripUpdated = value => dispatch => dispatch(tripUpdated(value));
