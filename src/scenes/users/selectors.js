export const getUser = state => userName => Object.values(state.UsersReducer.users).find(u => u.username === userName);

export const getServicesAvailed = state => userId =>
  Object.values(state.UsersReducer.servicesAvailed).filter(r => r.clientId === userId);

export const getServices = state => userId =>
  Object.values(state.UsersReducer.services).filter(s => s.owner && s.owner.id === userId);

export const getGivenServiceReviews = state => userId =>
  Object.values(state.UsersReducer.givenServiceReviews).filter(r => r.reviewUserId === userId);
