import Parse from 'parse';
import fetch_helpers from './../../libs/fetch_helpers';

export const trip_fetched = trip => ({
  type: 'TRIP_FETCHED',
  payload: trip,
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
  // all un-scheduled services will be grouped by null key
  const groupedTripOrganization = groupBy(tripOrganizations, tOrg => tOrg.day || null);
  const dayToServicesMapping = Object.keys(groupedTripOrganization).reduce(
    (mappings, dayIndex) => [
      ...mappings,
      {
        day: dayIndex,
        services: groupedTripOrganization[dayIndex].map(tOrg => tOrg.service),
      },
    ],
    [],
  );
  trip.organization = dayToServicesMapping;
  dispatch(trip_fetched({ trip }));
};

/* https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_groupby */
function groupBy(xs, f) {
  // eslint-disable-next-line
  return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}
