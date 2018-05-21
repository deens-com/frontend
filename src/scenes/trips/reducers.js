import { keyBy } from '../../libs/normalizer';
import { removeKey } from '../../libs/Utils';

const initialState = {
  trip: {},
  tripError: null,
  showTripUpdated: false,
};

export default function TripsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'TRIP_FETCHED':
      return {
        ...state,
        trip: action.payload.trip,
        tripError: null,
        tripOrganizations: keyBy(action.payload.tripOrganizations, 'objectId'),
        services: keyBy(action.payload.services, 'objectId'),
      };
    case 'TRIP_FETCH_ERROR': {
      return {
        ...state,
        tripError: action.payload,
      };
    }
    case 'CHANGE_SERVICE_DAY': {
      const { tripOrganizationId, newDay } = action.payload;
      return {
        ...state,
        tripOrganizations: {
          ...state.tripOrganizations,
          [tripOrganizationId]: {
            ...state.tripOrganizations[tripOrganizationId],
            day: newDay === 'null' ? undefined : newDay,
          },
        },
      };
    }
    case 'REMOVE_SERVICE_TRIP': {
      const tripOrganizationId = action.payload;
      return {
        ...state,
        tripOrganizations: removeKey(state.tripOrganizations, tripOrganizationId),
      };
    }
    case 'TRIP_UPDATED': {
      return {
        ...state,
        showTripUpdated: action.payload,
      };
    }
    default:
      return state;
  }
}
