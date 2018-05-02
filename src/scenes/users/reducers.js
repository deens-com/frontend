import { keyBy } from '../../libs/normalizer';

const initialState = {
  current_user: {},
  users: {}, // stores all users with userName as the Key
  tripsBooked: {},
  tripsAndServicesOffered: {}, // all the trips/services the user is offering
  trips: [],
  givenReviews: {},
  receivedReviews: {},
};

export default function UsersReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'FULL_USER_FETCHED': {
      const { user, tripsBooked, tripsAndServicesOffered, givenReviews, receivedReviews } = action.payload;
      const tripsBookedWithClientId = tripsBooked.map(s => ({ ...s, clientId: user.objectId }));
      return {
        ...state,
        users: { ...state.users, [user.objectId]: user },
        tripsBooked: { ...state.tripsBooked, ...keyBy(tripsBookedWithClientId, 'objectId') },
        tripsAndServicesOffered: { ...state.tripsAndServicesOffered, ...keyBy(tripsAndServicesOffered, 'objectId') },
        givenReviews: { ...state.givenReviews, ...keyBy(givenReviews, 'objectId') },
        receivedReviews: { ...state.receivedReviews, ...keyBy(receivedReviews, 'objectId') },
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
