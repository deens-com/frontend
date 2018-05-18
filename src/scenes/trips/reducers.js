import { keyBy } from '../../libs/normalizer';

const initialState = {
  trip: {}
};

export default function TripsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "TRIP_FETCHED":
      return {
        ...state,
        trip: action.payload.trip,
        tripOrganizations: keyBy(action.payload.tripOrganizations, 'objectId'),
        services: keyBy(action.payload.services, 'objectId'),
      };

    default:
      return state;
  }
}
