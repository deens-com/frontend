import axios from 'libs/axios';
import apiClient from 'libs/apiClient';
import rawAxios from 'axios';
import { parseLocationData } from 'libs/location';
import ObjectID from 'bson-objectid';
import { geocodeByPlaceId } from 'libs/placesAutocomplete';

export const PRIVACY_PUBLIC = 'public';
export const PRIVACY_PRIVATE = 'private';
export const PRIVACY_FRIENDS = 'unlisted';

export const patchTrip = async (id, data) => {
  return axios.patch(`/trips/${id}`, {
    ...data,
    ...(data.tags && { tags: data.tags.map(tag => (typeof tag === 'object' ? tag._id : tag)) }),
  });
};

export const duration = minutes => {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 24) return `${hours} hours`;
  const days = Math.ceil(minutes / (60 * 24));
  return `${days} days`;
};

export const addServiceRequest = async (id, day, serviceId) => {
  return addServiceManyDaysRequest(id, [day], serviceId);
};

export const addServiceManyDaysRequest = async (id, days, serviceId) => {
  return apiClient.trips.serviceOrganizations.post(id, { days, serviceId });
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

export function formatMedia(url) {
  return [
    {
      type: 'image',
      hero: true,
      names: {
        en: 'Trip image',
      },
      files: {
        original: {
          url,
        },
        hero: {
          url,
        },
      },
    },
  ];
}

export async function signAndUploadImage(file) {
  const signed = await apiClient.media.s3.sign.get([file.name]);
  let formData = new FormData();
  Object.keys(signed.data[0].post.fields).forEach(key => {
    formData.append(key, signed.data[0].post.fields[key]);
  });
  formData.append('file', file);

  try {
    await rawAxios.post(signed.data[0].post.url, formData);
  } catch (e) {
    console.log(e);
  }
  return signed.data[0].fileUrl;
}
