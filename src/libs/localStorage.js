import { env } from 'libs/config';

const tripKey = `deens-${env}-anonymous-trip`;
const favoriteTripsKey = `deens-${env}-favorite-trips`;
const favoriteServicesKey = `deens-${env}-favorite-services`;
const lastSearchKey = `deens-${env}-last-search-params`;

if (!('localStorage' in window)) {
  // this is shitty but at least Opera Mini users will be able to browse our website
  window.localStorage = {
    _data: {},
    setItem: function(id, val) {
      return (this._data[id] = String(val));
    },
    getItem: function(id) {
      return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
    },
    removeItem: function(id) {
      return delete this._data[id];
    },
    clear: function() {
      return (this._data = {});
    },
  };
}

export function saveTrip(trip) {
  const tripToSave = JSON.stringify({
    adultCount: trip.adultCount,
    childrenCount: trip.childrenCount,
    infantCount: trip.infantCount,
    peopleCount: trip.peopleCount,
    media: trip.media,
    otherAttributes: trip.otherAttributes,
    services: trip.services || [],
    title: trip.title,
    description: trip.description,
    location: trip.location,
    duration: trip.duration,
  });

  localStorage.setItem(tripKey, tripToSave);
  return tripToSave;
}

export function removeTrip() {
  localStorage.removeItem(tripKey);
}

export function isTripSaved() {
  const trip = JSON.parse(localStorage.getItem(tripKey));
  return Boolean(trip && trip.services && trip.services.length > 0);
}

function addFavorite(id, type) {
  const favKey = type === 'trip' ? favoriteTripsKey : favoriteServicesKey;
  const savedElems = localStorage.getItem(favKey);
  if (savedElems) {
    localStorage.setItem(
      favKey,
      JSON.stringify({
        ...JSON.parse(savedElems),
        [id]: true,
      }),
    );
    return;
  }
  localStorage.setItem(favKey, JSON.stringify({ [id]: true }));
}

export function addFavoriteTrip(id) {
  addFavorite(id, 'trip');
}

export function addFavoriteService(id) {
  addFavorite(id, 'service');
}

function removeFavorite(id, type) {
  const favKey = type === 'trip' ? favoriteTripsKey : favoriteServicesKey;
  const savedElems = localStorage.getItem(favKey);
  if (!savedElems) {
    return;
  }
  localStorage.setItem(
    favKey,
    JSON.stringify({
      ...JSON.parse(savedElems),
      [id]: false,
    }),
  );
}

export function removeFavoriteTrip(id) {
  removeFavorite(id, 'trip');
}

export function removeFavoriteService(id) {
  removeFavorite(id, 'service');
}

function getFavorites(type) {
  const favKey = type === 'trip' ? favoriteTripsKey : favoriteServicesKey;
  return JSON.parse(localStorage.getItem(favKey));
}

export function getFavoriteTrips() {
  getFavorites('trip');
}

export function getFavoriteServices() {
  getFavorites('service');
}

function clearFavorites(type) {
  const favKey = type === 'trip' ? favoriteTripsKey : favoriteServicesKey;
  localStorage.removeItem(favKey);
}

export function clearFavoriteTrips() {
  clearFavorites('trip');
}

export function clearFavoriteServices() {
  clearFavorites('services');
}

export function setLastSearchParams(params) {
  localStorage.setItem(lastSearchKey, JSON.stringify(params));
}

export function getLastSearchParams() {
  const params = JSON.parse(localStorage.getItem(lastSearchKey));
  if (!params) {
    return null;
  }
  if (!params.locationSearchType) {
    delete params.lat;
    delete params.lng;
    delete params.countryCode;
    delete params.state;
    delete params.city;
    delete params.address;
  }
  return params;
}
