const initialState = {
  places: []
};

export default function ServicesReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "PLACES_FETCHED":
      return {
        ...state,
        places: action.payload.places
      };

    default:
      return state;
  }
}
