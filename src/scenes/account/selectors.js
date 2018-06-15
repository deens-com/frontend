export const isServiceUnConfirmed = state => (tripId, serviceId) => {
  const { failedReservations } = state.AccountReducer;
  return failedReservations.some(
    ({ trip, service, transactionStatus }) =>
      trip && service && trip.objectId === tripId && service.objectId === serviceId && transactionStatus === 0
  );
};
