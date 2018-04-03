const initialState = {
  places: [],
  activities: [],
  foods: [],
  trips: []
};

export default function ResultsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "PLACES_FETCHED":
      return {
        ...state,
        places: action.payload.places
      };
    case "ACTIVITIES_FETCHED":
      return {
        ...state,
        activities: action.payload.activities
      };
    case "FOODS_FETCHED":
      return {
        ...state,
        foods: action.payload.foods
      };
    case "TRIPS_FETCHED":
      return {
        ...state,
        trips: action.payload.trips
      };

    default:
      return state;
  }
}
