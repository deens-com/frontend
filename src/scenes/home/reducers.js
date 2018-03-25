const initialState = {
  services: [],
  trips: [],
  tags: [],
  popularPlaces: []
};

export default function homeReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "SERVICES_FETCHED":
      return {
        ...state,
        services: action.payload.services
      };
    case "TRIPS_FETCHED":
      return {
        ...state,
        trips: action.payload.trips
      };
    case "POPULAR_TAGS_RETRIEVED":
      return {
        ...state,
        tags: action.payload
      };
    case "POPULAR_PLACES_RETRIEVED":
      return {
        ...state,
        popularPlaces: action.payload.popularPlaces
      };
    default:
      return state;
  }
}
