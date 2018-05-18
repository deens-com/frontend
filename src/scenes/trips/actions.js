import Parse from 'parse';
import fetch_helpers from './../../libs/fetch_helpers';

export const trip_fetched = trip => ({
  type: 'TRIP_FETCHED',
  payload: trip,
});

export const tripChangeServiceDay = (tripOrganizationId, newDay) => ({
  type: 'CHANGE_SERVICE_DAY',
  payload: { tripOrganizationId, newDay },
});

export const fetchTrip = tripId => async dispatch => {
  if (!tripId) {
    console.error(new Error("can't fetch trip without TripId"));
    return;
  }

  const Trip = Parse.Object.extend('Trip');
  const [tripRaw, tripOrganizationsRaw] = await Promise.all([
    fetch_helpers.build_query('Trip').get(tripId),
    fetch_helpers
      .build_query('TripOrganization')
      .equalTo('trip', new Trip({ id: tripId }))
      .include('service')
      .find(),
  ]);
  const trip = fetch_helpers.normalizeParseResponseData(tripRaw);
  const tripOrganizations = fetch_helpers.normalizeParseResponseData(tripOrganizationsRaw);
  const tripOrganizationMappings = tripOrganizations.map(tOrg => ({
    objectId: tOrg.objectId,
    tripId: tOrg.trip.objectId,
    serviceId: tOrg.service.objectId,
    day: tOrg.day,
  }));
  const services = tripOrganizations.map(tOrg => tOrg.service);
  dispatch(trip_fetched({ trip, tripOrganizations: tripOrganizationMappings, services }));
};

export const changeServiceDay = (tripOrganizationId, newDay) => async dispatch => {
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
};
