export const getUser = state => userName => Object.values(state.UsersReducer.users).find(u => u.username === userName);

export const getServicesAvailed = state => userId =>
  Object.values(state.UsersReducer.servicesAvailed).filter(r => r.clientId === userId);

export const getTripsAndServicesOffered = state => userId =>
  Object.values(state.UsersReducer.tripsAndServicesOffered).filter(s => s.owner && s.owner.objectId === userId);

export const getGivenReviews = state => userId =>
  Object.values(state.UsersReducer.givenReviews).filter(r => r.reviewedByUserId === userId);
