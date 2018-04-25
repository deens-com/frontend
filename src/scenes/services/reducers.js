const initialState = {
  service: {},
  trips: [],
  reviews: []
};

export default function ServicesReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "SERVICE_FETCHED":
      return {
        ...state,
        service: action.payload.service
      };
    case "TRIPS_FETCHED":
      return {
        ...state,
        trips: action.payload.trips
      };
    case "REVIEWS_FETCHED":
      return {
        ...state,
        reviews: action.payload.reviews
      }
    default:
      return state;
  }
}
