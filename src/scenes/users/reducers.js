import { keyBy } from '../../libs/normalizer';

const initialState = {
  current_user: {},
  users: {}, // stores all users with userName as the Key
  reservations: {},
  services: {},
  trips: [],
  given_reviews: [],
  received_reviews: [],
};

export default function UsersReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'FULL_USER_FETCHED': {
      const { user, reservations, services } = action.payload;
      return {
        ...state,
        users: { ...state.users, [user.objectId]: user },
        reservations: { ...state.reservations, ...keyBy(reservations, 'objectId') },
        services: {...state.services, ...keyBy(services, 'objectId')}
      };
    }
    case 'TRIPS_FETCHED':
      return { ...state, trips: action.payload.trips };
    case 'GIVEN_REVIEWS_FETCHED':
      return { ...state, given_reviews: action.payload.given_reviews };
    case 'RECEIVED_REVIEWS_FETCHED':
      return { ...state, received_reviews: action.payload.received_reviews };
    default:
      return state;
  }
}
