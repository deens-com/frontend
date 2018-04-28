const initialState = {
  current_user: {},
  users: {},  // stores all users with userName as the Key
  trips: [],
  given_reviews: [],
  received_reviews: []
};

export default function UsersReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'USER_FETCHED':
      const { payload: user } = action;
      return {
        ...state,
        users: {
          ...state.users,
          [user.username]: user,
        },
      };
    case "TRIPS_FETCHED":
      return {
        ...state,
        trips: action.payload.trips
      };
    case "GIVEN_REVIEWS_FETCHED":
      return {
        ...state,
        given_reviews: action.payload.given_reviews
      }
    case "RECEIVED_REVIEWS_FETCHED":
      return {
        ...state,
        received_reviews: action.payload.received_reviews
      }
    default:
      return state;
  }
}
