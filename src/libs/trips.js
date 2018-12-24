import axios from 'libs/axios';

export const patchTrip = async (id, data) => {
  return axios.patch(`/trips/${id}`, {
    ...data,
    ...(data.tags && { tags: data.tags.map(tag => (typeof tag === 'object' ? tag._id : tag)) }),
  });
};

export const addServiceToTrip = (tripServices, service, day) => {
  return [
    ...tripServices,
    {
      service,
      day,
      notes: [],
      priority: 1,
    },
  ];
};
