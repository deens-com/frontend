const initialState = {
  service: {},
  trips: []
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
    default:
      return state;
  }
}
