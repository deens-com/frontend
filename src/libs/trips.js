import moment from 'moment';
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

export const duration = minutes => {
  const humanizedDuration = moment.duration(minutes || 0, 'minutes').humanize();
  let startsWithLetter = '';
  if (humanizedDuration.startsWith('a ')) {
    startsWithLetter = 'a';
  }

  if (humanizedDuration.startsWith('an ')) {
    startsWithLetter = 'an';
  }

  if (startsWithLetter) {
    return humanizedDuration.replace(startsWithLetter, '1');
  }

  return humanizedDuration;
};

export const addServiceRequest = async (id, day, serviceId) => {
  return apiClient.trips.serviceOrganizations.post(id, { days: [day], serviceId });
};

export const removeServiceRequest = async (id, serviceOrgId) => {
  return apiClient.trips.serviceOrganizations.remove(id, [serviceOrgId]);
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
  const { city, state, countryCode } = parseLocationData(currentResult);

  const { lat: latFn, lng: lngFn } = currentResult.geometry.location;

  return {
    city,
    state,
    countryCode,
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
    if (location.countryCode) {
      address = addToFormattedAddress(address, location.countryCode);
    }
  }

  return address;
};

export const minutesToHoursOrDays = minutes => {
  if (minutes > 5760) {
    return {
      length: minutes / 60 / 24,
      unit: 'days',
    };
  }
  return {
    length: minutes / 60,
    unit: 'hours',
  };
};

export const secondsToHoursAndMinutes = seconds => {
  if (typeof seconds !== 'number') {
    return null;
  }

  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
  };
};

export const calculateCancellationCharge = (policy, price) => {
  if (policy.refundType === 'percent') {
    return price - ((price * policy.refundAmount) / 100).toFixed(2);
  }

  return (price - policy.refundAmount).toFixed(2);
};
