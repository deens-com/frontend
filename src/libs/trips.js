import axios from 'libs/axios';

export const patchTrip = async (id, data) => {
  return axios.patch(`/trips/${id}`, {
    ...data,
    ...(data.tags && { tags: data.tags.map(tag => (typeof tag === 'object' ? tag._id : tag)) }),
  });
};

export const addServiceToTrip = (tripServices, service, day) => {
  const serviceId = typeof service !== 'object' ? service : service._id;

  const alreadyAdded = tripServices.find(
    tripService =>
      (tripService.service === serviceId || tripService.service._id === serviceId) &&
      tripService.day === day,
  );

  if (alreadyAdded) {
    return tripServices;
  }

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
