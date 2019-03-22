import { env } from 'libs/config';

const tripKey = `deens-${env}-anonymous-trip`;
const favoriteTripsKey = `deens-${env}-favorite-trips`;

function removeUselessFields(trip) {
  // this could be removed in the future
  // it's for already saved trips to not break the app
  delete trip._id;
  delete trip.owner;
  delete trip.bookingStatus;
  delete trip.privacy;
  delete trip.status;
  delete trip.reviewCount;
  delete trip.ratings;
  delete trip.forkedBookingCounts;
  delete trip.tags;
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

export function loadTrip(withFullServices = true) {
  const localStorageTrip = localStorage.getItem(tripKey);
  if (localStorageTrip) {
    const trip = JSON.parse(localStorageTrip);
    removeUselessFields(trip);

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
      'en-us': 'Unnamed Trip',
    },
    services: [],
    media: [],
    basePrice: 0,
    duration: 1,
  };
}

export function addFavoriteTrip(id) {
  const savedTrips = localStorage.getItem(favoriteTripsKey);
  if (savedTrips) {
    localStorage.setItem(
      favoriteTripsKey,
      JSON.stringify({
        ...JSON.parse(savedTrips),
        [id]: true,
      }),
    );
    return;
  }
  localStorage.setItem(favoriteTripsKey, JSON.stringify({ [id]: true }));
}

export function removeFavoriteTrip(id) {
  const savedTrips = localStorage.getItem(favoriteTripsKey);
  if (!savedTrips) {
    return;
  }
  localStorage.setItem(
    favoriteTripsKey,
    JSON.stringify({
      ...JSON.parse(savedTrips),
      [id]: false,
    }),
  );
}

export function getFavoriteTrips() {
  return JSON.parse(localStorage.getItem(favoriteTripsKey));
}

export function clearFavoriteTrips() {
  localStorage.removeItem(favoriteTripsKey);
}
