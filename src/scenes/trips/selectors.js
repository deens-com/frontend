export const getScheduledServices = state => {
  const { trip } = state.TripsReducer;
  if (!trip.organization) return [];
  return trip.organization.filter(tOrg => tOrg.day != null && tOrg.day !== 'null');
};

export const getUnScheduledServices = state => {
  const { trip } = state.TripsReducer;
  if (!trip.organization) return [];
  return trip.organization.filter(tOrg => tOrg.day == null || tOrg.day === 'null');
};
