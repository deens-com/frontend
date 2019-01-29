import { env } from 'libs/config';

const tripKey = `please-${env}-anonymous-trip`;

export function saveTrip(trip) {
  const tripToSave = {
    ...trip,
  };

  if (tripToSave._id) {
    delete tripToSave._id;
  }

  localStorage.setItem(tripKey, JSON.stringify(tripToSave));
}

export function removeTrip() {
  localStorage.removeItem(tripKey);
}

export function isTripSaved() {
  const trip = JSON.parse(localStorage.getItem(tripKey));
  return Boolean(trip && trip.services && trip.services.length > 0);
}

export function loadTrip(withFullServices = true) {
  const localStorageTrip = localStorage.getItem(tripKey);
  if (localStorageTrip) {
    const trip = JSON.parse(localStorageTrip);
    if (trip._id) {
      delete trip._id;
    }
    return {
      ...trip,
      services: withFullServices
        ? trip.services
        : trip.services.map(service => ({
            ...service,
            service: service.service._id,
          })),
    };
  }
  return {
    title: {
      'en-us': 'New Trip',
    },
    services: [],
    media: [],
    basePrice: 0,
    duration: 1,
  };
}
