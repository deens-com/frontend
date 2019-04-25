import {
  geocodeByAddress as geoByAddress,
  geocodeByPlaceId as geoByPlaceId,
  getLatLng as getLat,
} from 'react-places-autocomplete';
import { waitUntilMapsLoaded } from 'libs/Utils';

let hasLoaded = false;
waitUntilMapsLoaded().then(() => (hasLoaded = true));

const waitAndReturn = fn => async (...params) => {
  if (!hasLoaded) {
    await waitUntilMapsLoaded();
  }
  return fn(...params);
};

export const geocodeByAddress = waitAndReturn(geoByAddress);
export const geocodeByPlaceId = waitAndReturn(geoByPlaceId);
export const getLatLng = waitAndReturn(getLat);
