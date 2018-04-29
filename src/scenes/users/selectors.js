export const getUser = state => userName => Object.values(state.UsersReducer.users).find(u => u.username === userName);

export const getReservations = state => userId => Object.values(state.UsersReducer.reservations).filter(r => r.client && r.client.id === userId);

export const getServices = state => userId => Object.values(state.UsersReducer.services).filter(s => s.owner && s.owner.id === userId);
