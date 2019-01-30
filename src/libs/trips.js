import axios from 'libs/axios';
import apiClient from 'libs/apiClient';
import { parseLocationData } from 'libs/location';
import ObjectID from 'bson-objectid';
import { geocodeByPlaceId } from 'react-places-autocomplete';

export const patchTrip = async (id, data) => {
  return axios.patch(`/trips/${id}`, {
    ...data,
    ...(data.tags && { tags: data.tags.map(tag => (typeof tag === 'object' ? tag._id : tag)) }),
  });
};

export const addServiceRequest = async (id, day, serviceId) => {
  return apiClient.trips.addService.post(id, { day, serviceId });
};

export const addServiceToTrip = (tripServices, service, day) => {
  return [
    ...tripServices,
    {
      service,
      day,
      notes: [],
      priority: 1,
      _id: ObjectID.generate(),
    },
  ];
};

export const getLocationBasedOnPlaceId = async placeId => {
  const results = await geocodeByPlaceId(placeId);
  const currentResult = results[0];
  const { city, state, countryCode, country } = parseLocationData(currentResult);

  const { lat: latFn, lng: lngFn } = currentResult.geometry.location;

  return {
    city,
    state,
    countryCode,
    country,
    geo: {
      type: 'Point',
      coordinates: [lngFn(), latFn()],
    },
  };
};

const addToFormattedAddress = (address, place) => {
  if (address) {
    return address.concat(`, ${place}`);
  }

  return place;
};

export const getFormattedAddress = location => {
  let address = '';

  if (location) {
    if (location.city) {
      address = addToFormattedAddress(address, location.city);
    }
    if (location.state) {
      address = addToFormattedAddress(address, location.state);
    }
    if (location.countryCode || location.country) {
      address = addToFormattedAddress(address, location.country || location.countryCode);
    }
  }

  return address;
};
