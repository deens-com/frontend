const initialState = {
  trip: {}
};

export default function TripsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "TRIP_FETCHED":
      return {
        ...state,
        trip: action.payload.trip
      };

    default:
      return state;
  }
}
