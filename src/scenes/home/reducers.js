const initialState = {
  services: [],
  trips: [],
  tags: [],
  popularPlaces: [],
  exciting_activities: []
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
    case "EXCITING_ACTIVITIES_RETRIEVED":
      return {
        ...state,
        exciting_activities: action.payload.exciting_activities
      };
    default:
      return state;
  }
}
