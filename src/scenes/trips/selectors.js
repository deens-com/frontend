import moment from 'moment';

export const getDaysWithFilter = (state, filter) => {
  const { tripOrganizations, services, serviceAvailabilities } = state.TripsReducer;
  if (!tripOrganizations) return [];

  const scheduledServices = Object.values(tripOrganizations)
    .filter(filter)
    .map(tOrg => ({ ...services[tOrg.serviceId], tripOrganizationId: tOrg.objectId, day: tOrg.day }));
  const days = {};
  for (const service of scheduledServices) {
    const serviceDay = service.day || 'null';
    service.availability = serviceAvailabilities[service.objectId];
    days[serviceDay] = days[serviceDay] || { day: serviceDay, services: [] };
    days[serviceDay].services.push(service);
  }
  return days;
};

export const getScheduledServices = state => {
  const dayObjects = getDaysWithFilter(state, tOrg => tOrg.day != null && tOrg.day !== 'null');
  const { trip } = state.TripsReducer;
  if (trip.beginDate && trip.endDate) {
    const diffDays = moment(trip.endDate.iso).diff(moment(trip.beginDate.iso), 'days') + 1;
    for (let dayIndex = 1; dayIndex <= diffDays; dayIndex++) {
      dayObjects[dayIndex] = dayObjects[dayIndex] || { day: dayIndex, services: [] };
    }
  }
  return Object.values(dayObjects);
};

export const getUnScheduledServices = state => {
  const dayObjects = getDaysWithFilter(state, tOrg => tOrg.day == null || tOrg.day === 'null');
  const dayIndex = 'null';
  dayObjects[dayIndex] = dayObjects[dayIndex] || { day: dayIndex, services: [] };
  return Object.values(dayObjects);
};

/**
 * Sums up the total price of a trip, by iterating over all the scheduled services
 */
export const getTripTotalPrice = state => {
  const scheduledServices = getScheduledServices(state);
  return scheduledServices
    .reduce((services, tripOrg) => [...services, ...tripOrg.services], [])
    .reduce((sum, service) => sum + service.pricePerSession, 0);
};
