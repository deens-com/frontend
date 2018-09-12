export const getDaysWithFilter = (state, filter) => {
  const { tripOrganizations, services, serviceAvailabilities } = state.TripsReducer;
  if (!tripOrganizations) return [];

  const scheduledServices = Object.values(tripOrganizations)
    .filter(filter)
    .map(tOrg => ({
      ...services[tOrg.serviceId],
      tripOrganizationId: tOrg.objectId,
      day: tOrg.day,
    }));
  const days = {};
  for (const service of scheduledServices) {
    const serviceDay = service.day || 'null';
    service.availability = serviceAvailabilities[service.objectId];
    days[serviceDay] = days[serviceDay] || { day: serviceDay, services: [] };
    days[serviceDay].services.push(service);
  }
  return days;
};

// new
export const getServicesGroupedByDay = state => {
  const dayObjects = {};
  const { trip } = state.TripsReducer;
  if (!trip || !trip._id) return {};
  for (const { day, service } of trip.services) {
    dayObjects[day] = dayObjects[day] || { day, services: [] };
    dayObjects[day].services.push(service);
  }
  return Object.values(dayObjects);
};

// TODO: remove getScheduledServices as it was used when we had Parse
// old
export const getScheduledServices = state => {
  const dayObjects = getDaysWithFilter(state, tOrg => tOrg.day != null && tOrg.day !== 'null');
  const { trip } = state.TripsReducer;
  for (let dayIndex = 1; dayIndex <= trip.dayCount; dayIndex++) {
    dayObjects[dayIndex] = dayObjects[dayIndex] || { day: dayIndex, services: [] };
  }
  return Object.values(dayObjects);
};
