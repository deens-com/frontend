const initialState = {
  trips: []
};

export default function TripsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "TRIPS_FETCHED":
      return {
        ...state,
        places: action.payload.trips
      };

    default:
      return state;
  }
}
