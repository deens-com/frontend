import axios from 'libs/axios';
import apiClient from 'libs/apiClient';

export const patchTrip = async (id, data) => {
  return axios.patch(`/trips/${id}`, {
    ...data,
    ...(data.tags && { tags: data.tags.map(tag => (typeof tag === 'object' ? tag._id : tag)) }),
  });
};

export const addServiceRequest = async (id, day, serviceId) => {
  return apiClient.trips.addService.post(id, { day, serviceId });
};

function makeRandomUniqueId(tripServices) {
  const temporalId = Math.ceil(Math.random() * 100000);

  if (tripServices.find(elem => elem._id === temporalId)) {
    return makeRandomUniqueId(tripServices);
  }

  return temporalId;
}

export const addServiceToTrip = (tripServices, service, day) => {
  const temporalId = makeRandomUniqueId(tripServices);

  return [
    ...tripServices,
    {
      service,
      day,
      notes: [],
      priority: 1,
      _id: temporalId,
    },
  ];
};
