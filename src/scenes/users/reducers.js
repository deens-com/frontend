import { keyBy } from '../../libs/normalizer';

const initialState = {
  current_user: {},
  users: {}, // stores all users with userName as the Key
  servicesAvailed: {},
  services: {},
  trips: [],
  givenReviews: {},
  received_reviews: [],
};

export default function UsersReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'FULL_USER_FETCHED': {
      const { user, servicesAvailed, services, givenReviews } = action.payload;
      const servicesAvailedWithClientId = servicesAvailed.map(s => ({ ...s, clientId: user.objectId }));
      return {
        ...state,
        users: { ...state.users, [user.objectId]: user },
        servicesAvailed: { ...state.servicesAvailed, ...keyBy(servicesAvailedWithClientId, 'objectId') },
        services: { ...state.services, ...keyBy(services, 'objectId') },
        givenReviews: { ...state.givenReviews, ...keyBy(givenReviews, 'objectId') },
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
