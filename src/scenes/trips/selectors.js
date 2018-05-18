export const getDaysWithFilter = (state, filter) => {
  const { tripOrganizations, services } = state.TripsReducer;
  if (!tripOrganizations) return [];

  const scheduledServices = Object.values(tripOrganizations)
    .filter(filter)
    .map(tOrg => ({ ...services[tOrg.serviceId], day: tOrg.day }));
  const days = {};
  for (const service of scheduledServices) {
    days[service.day] = days[service.day] || { day: service.day, services: [] };
    days[service.day].services.push(service);
  }
  return Object.values(days);
};

export const getScheduledServices = state => {
  return getDaysWithFilter(state, tOrg => tOrg.day != null && tOrg.day !== 'null');
};

export const getUnScheduledServices = state => {
  return getDaysWithFilter(state, tOrg => tOrg.day == null || tOrg.day === 'null');
};
