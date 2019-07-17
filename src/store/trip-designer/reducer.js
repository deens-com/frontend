import actions from './actions';
import { minutesToDays } from 'libs/Utils';

function generateDaysData(trip) {
  const days = minutesToDays(trip.duration);
  let daysData = {};
  for (let i = 1; i <= days; i++) {
    daysData[i] = {
      notes: trip.notes ? trip.notes[i] : undefined,
    };
  }
  return daysData;
}

const initialState = {
  trip: {
    isLoading: false,
    data: null,
    error: null,
  },
  availabilities: {
    isLoading: false,
    data: null,
    error: null,
  },
  transports: {},
  image: null,
  // transportation methods
  fromService: {},
  toService: {},
  // this booleans are numbers so we can make many requests.
  // probably it would be better to have timestamps to avoid race conditions
  isSaving: 0,
  isCheckingAvailability: false,
  isLoadingTransportation: 0,
  isLoadingPrice: 0,
  // this is for allowing to undo
  lastRemovedService: null,
};

export default function tripDesigner(state = initialState, action = {}) {
  switch (action.type) {
    case actions.types.LOAD_TRANSPORTS_START:
      return {
        ...state,
        isLoadingTransportation: state.isLoadingTransportation + 1,
      };
    case actions.types.LOAD_TRANSPORTS_SUCCESS:
      return {
        ...state,
        isLoadingTransportation: state.isLoadingTransportation - 1,
        transports: action.payload,
      };
    case actions.types.LOAD_TRANSPORTS_ERROR:
      return {
        ...state,
        isLoadingTransportation: state.isLoadingTransportation - 1,
        transports: {},
      };
    case actions.types.CHECK_AVAILABILITY_START:
      return {
        ...state,
        availabilities: {
          isLoading: true,
          error: null,
          data: null,
        },
      };
    case actions.types.CHECK_AVAILABILITY_SUCCESS:
      return {
        ...state,
        trip: {
          ...state.trip,
          data: {
            ...state.trip.data,
            ...action.payload.trip,
          },
        },
        availabilities: {
          isLoading: false,
          error: null,
          data: action.payload && action.payload.availabilities,
        },
      };
    case actions.types.CHECK_AVAILABILITY_ERROR:
      return {
        ...state,
        availabilities: {
          isLoading: false,
          error: action.payload && action.payload.message,
          data: null,
        },
      };
    case actions.types.FETCH_TRIP_START:
      return {
        ...state,
        trip: {
          isLoading: false,
          error: null,
          data: null,
        },
      };
    case actions.types.FETCH_TRIP_SUCCESS:
      return {
        ...state,
        trip: {
          isLoading: false,
          error: null,
          // to avoid caching issues we store the trip here
          // this should be changed to treat it as an entity
          // when we have a way to invalidate cache
          data: action.payload.entities.trips[action.payload.result],
        },
      };
    case actions.types.FETCH_TRIP_ERROR:
      return {
        ...state,
        trip: {
          isLoading: false,
          error: action.payload && action.payload.message,
          data: null,
        },
      };
    case actions.types.PATCH_TRIP_START:
      return {
        ...state,
        trip: {
          data: action.payload,
        },
      };
    case actions.types.PATCH_TRIP_SUCCESS:
      return {
        ...state,
        trip: {
          data: action.payload,
        },
      };
    case actions.types.PATCH_TRIP_ERROR:
      return {
        ...state,
        trip: {
          error: action.error && action.error.message,
          data: action.payload,
        },
      };
    default:
      return state;
  }
}
