import { env } from 'libs/config';

const tripKey = `please-${env}-anonymous-trip`;

export function saveTrip(trip) {
  localStorage.setItem(tripKey, JSON.stringify(trip));
}

export function removeTrip() {
  localStorage.removeItem(tripKey);
}

export function loadTrip() {
  const localStorageUser = localStorage.getItem(tripKey);
  if (localStorageUser) {
    return JSON.parse(localStorageUser);
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
