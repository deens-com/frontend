import Parse from 'parse';
import moment from 'moment';
import fetch_helpers from './../../libs/fetch_helpers';
import { getISODateString } from 'libs/Utils';
import { generateFilename } from 'libs/filename';
import { trackTripCloned } from 'libs/analytics';

export const tripFetchStart = () => ({ type: 'TRIP_FETCH_START' });
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

export const serviceAvailabilitiesStart = () => ({ type: 'SERVICE_AVAILIBILITIES_START' });
export const serviceAvailabilitiesSuccess = obj => ({
  type: 'SERVICE_AVAILIBILITIES_SUCCESS',
  payload: obj,
});
export const setTripCloningStatus = status => ({ type: 'CLONING_STATUS', payload: status });

const isCurrentUser = userObject => {
  const currentUser = Parse.User.current();
  return (userObject && (userObject.objectId || userObject.id)) === (currentUser && currentUser.id);
};

export const fetchTrip = tripId => async (dispatch, getState) => {
  if (!tripId) {
    console.error(new Error("can't fetch trip without TripId"));
    return;
  }
  try {
    dispatch(tripFetchStart());
    const { trip: originalTrip, tripOrganizationMappings, services, notes } = await Parse.Cloud.run(
      'fetchTrip',
      {
        id: tripId,
        includes: ['services', 'notes'],
      },
    );
    const trip = fetch_helpers.mapServiceObjects([
      fetch_helpers.normalizeParseResponseData(originalTrip),
    ])[0];
    dispatch(trip_fetched({ trip, tripOrganizations: tripOrganizationMappings, services, notes }));
    postFetchTripActions(trip, dispatch, getState);
  } catch (error) {
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) dispatch(tripFetchError(error));
  }
};

function postFetchTripActions(trip, dispatch, getState) {
  const { title, numberOfPerson: peopleCount, formattedAddress, tags } = trip;
  const isOwner = isCurrentUser(trip.owner);
  let startDate = new Date(getISODateString(trip.beginDate));
  if (!isOwner) {
    const newStartDate = moment()
      .utc()
      .add(1, 'day')
      .startOf('day');
    startDate = newStartDate.toDate();
  }
  updateTripQuery({
    person: { label: peopleCount, value: peopleCount },
    formattedAddress,
    title,
    startDate,
    tags,
  })(dispatch, getState);
  checkAvailability(startDate, peopleCount)(dispatch, getState);
}

export const changeServiceDay = (tripOrganizationId, newDay) => async (dispatch, getState) => {
  if (!tripOrganizationId) {
    console.error(new Error("can't update service day without tripOrganizationId"));
  }
  dispatch(tripChangeServiceDay(tripOrganizationId, newDay));
  const tripOrganization = await fetch_helpers
    .build_query('TripOrganization')
    .get(tripOrganizationId);
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
  const tripOrganization = await fetch_helpers
    .build_query('TripOrganization')
    .get(tripOrganizationId);
  tripOrganization.destroy();
};

export const updateTrip = (newDetails, showSaved) => async (dispatch, getState) => {
  if (!newDetails) return;
  if (Object.keys(newDetails).length === 0) return;
  const state = getState();
  const tripId = state.TripsReducer.trip.objectId;
  await Parse.Cloud.run('updateTripDetails', { tripId, ...newDetails });
  fetchTrip(tripId)(dispatch, getState);
};

export const checkAvailability = (beginDate, peopleCount) => async (dispatch, getState) => {
  if (!beginDate) return;
  const state = getState();
  const { objectId: tripId, booked } = state.TripsReducer.trip;
  dispatch(serviceAvailabilitiesStart());
  if (booked) {
    dispatch(serviceAvailabilitiesSuccess({}));
    return;
  }
  const result = await Parse.Cloud.run('checkAvailabilityByTrip', {
    tripId,
    beginDate,
    peopleCount,
  });
  dispatch(serviceAvailabilitiesSuccess(result));
};

export const cloneTrip = (beginDate, peopleCount, history) => async (dispatch, getState) => {
  const state = getState();
  const tripId = state.TripsReducer.trip.objectId;
  dispatch(setTripCloningStatus(fetch_helpers.statuses.STARTED));
  try {
    const result = await Parse.Cloud.run('preBookingStep', { tripId, beginDate, peopleCount });
    dispatch({
      type: 'TRIP_CLONNED',
      payload: result,
      meta: { analytics: trackTripCloned(result) },
    });
    if (result.allAvailable) {
      // if all the services are available take the user to Checkout Page
      history.push(`/checkout/${result.newTripId}`);
    }
  } catch (error) {
    dispatch(setTripCloningStatus(fetch_helpers.statuses.ERROR));
  }
};

/**
 * Once the user has selected the image for the trip
 * The component calls this action to upload the image
 */
export const onImageSelect = file => async (dispatch, getState) => {
  if (!file) return;
  const state = getState();
  const tripId = state.TripsReducer.trip.objectId;
  const filename = generateFilename(file.name);
  try {
    dispatch({ type: 'TRIP/UPDATE_IMAGE_START' });
    const [trip, parseFile] = await Promise.all([
      fetch_helpers.build_query('Trip').get(tripId),
      new Parse.File(filename, file).save(),
    ]);
    await trip.save({ picture: parseFile });
    dispatch({ type: 'TRIP/UPDATE_IMAGE_FINISH' });
    fetchTrip(tripId)(dispatch, getState);
  } catch (error) {
    console.error(error);
    dispatch({ type: 'TRIP/UPDATE_IMAGE_ERROR' });
  }
};

export const removePreBookingResults = () => dispatch => {
  dispatch({ type: 'TRIP_CLONNED', payload: null });
};

/**
 * Updates the startDate, person count in the ToolBar
 */
export const updateTripQuery = values => dispatch => {
  if (!values) return;
  dispatch({ type: 'TRIP_QUERY_UPDATE', payload: values });
};

/**
 * This sets the value in redux that's responsible for showing the saved feedback to the user
 * when the trip status changes
 */
export const setShowTripStatusChanged = showStatusChanged => dispatch => {
  dispatch({ type: 'SHOW_TRIP_STATUS_CHANGED', payload: showStatusChanged });
};

/**
 * when exiting a scene it clears the store data related to trip
 */
export const resetTripData = () => dispatch => {
  dispatch({ type: 'TRIP/RESET' });
};

/**
 * Upserts a Day note
 */
export const saveDayNote = ({ note, day, noteId }) => async (dispatch, getState) => {
  if (note == null) return;
  const state = getState();
  const tripId = state.TripsReducer.trip.objectId;
  if (noteId && note === '') {
    await Parse.Cloud.run('deleteNote', { note, noteId });
    dispatch({ type: 'TRIP/DAY_NOTE_REMOVED', payload: { day } });
  } else {
    const savedNote = await Parse.Cloud.run('upsertNote', { note, dayNumber: day, noteId, tripId });
    dispatch({ type: 'TRIP/DAY_NOTE_SAVED', payload: savedNote });
  }
};

export const copyServiceToDay = ({ serviceId, day }) => async (dispatch, getState) => {
  if (!serviceId || !day) return;
  const state = getState();
  const tripId = state.TripsReducer.trip.objectId;
  await Parse.Cloud.run('addServiceToTrip', { serviceId, tripId, day });
  fetchTrip(tripId)(dispatch, getState);
};
