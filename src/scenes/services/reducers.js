const initialState = {
  places: [],
  activities: [],
  foods: []
};

export default function ServicesReducer(state = initialState, action = {}) {
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

    default:
      return state;
  }
}
