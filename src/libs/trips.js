import axios from 'libs/axios';
import apiClient from 'libs/apiClient';
import ObjectID from 'bson-objectid';

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
