import actions from './actions';

const initialState = {
  trip: {
    isLoading: false,
    data: null,
    error: null,
  },
  availabilities: {
    isLoading: false,
    data: {},
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
  isLoadingTransportation: 0,
  isLoadingPrice: 0,
  // this is for allowing to undo
  lastRemovedService: [],
  suggestedTags: [],
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
          data: {},
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
          data: action.payload.availabilities.reduce(
            (prev, current) => ({
              ...prev,
              [current.serviceOrganizationId]: current,
            }),
            {},
          ),
        },
      };
    case actions.types.CHECK_AVAILABILITY_ERROR:
      return {
        ...state,
        availabilities: {
          isLoading: false,
          error: action.payload && action.payload.message,
          data: {},
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
          ...state.trip,
          data: action.payload,
        },
      };
    case actions.types.PATCH_TRIP_ERROR:
      return {
        ...state,
        trip: {
          ...state.trip,
          error: action.error && action.error.message,
          data: action.payload,
        },
      };
    case actions.types.REMOVE_SERVICES_START:
      return {
        ...state,
        trip: {
          ...state.trip,
          data: {
            ...state.trip.data,
            services: state.trip.data.services.filter(sId => !action.payload.includes(sId)),
          },
        },
      };
    case actions.types.UNDO_REMOVE_SERVICE:
      return {
        ...state,
        trip: {
          ...state.trip,
          data: {
            ...state.trip.data,
            services: [
              ...state.trip.data.services.slice(
                0,
                state.lastRemovedService[state.lastRemovedService.length - 1].position,
              ),
              state.lastRemovedService[state.lastRemovedService.length - 1].id,
              ...state.trip.data.services.slice(
                state.lastRemovedService[state.lastRemovedService.length - 1].position,
                state.trip.data.services.length,
              ),
            ],
          },
        },
        lastRemovedService: state.lastRemovedService.slice(0, state.lastRemovedService.length - 1),
      };
    case actions.types.ADD_CUSTOM_SERVICE_SUCCESS:
      return {
        ...state,
        trip: {
          ...state.trip,
          data: action.payload.trip,
        },
      };
    case actions.types.REMOVE_SERVICE_START:
      return {
        ...state,
        trip: {
          ...state.trip,
          data: {
            ...state.trip.data,
            services: state.trip.data.services.filter(sId => action.payload !== sId),
          },
        },
        lastRemovedService: [
          ...state.lastRemovedService,
          { id: action.payload, position: state.trip.data.services.indexOf(action.payload) },
        ],
      };
    case actions.types.REMOVE_SERVICE_SUCCESS:
      return {
        ...state,
        trip: {
          ...state.trip,
          data: {
            ...action.payload.trip,
            services: action.payload.trip.services.filter(
              s => !state.lastRemovedService.find(removed => removed.id === s),
            ),
          },
        },
        lastRemovedService: state.lastRemovedService.filter(
          s => s.id !== action.payload.removedService,
        ),
      };
    case actions.types.REMOVE_DAY_START:
      return {
        ...state,
        trip: {
          ...state.trip,
          data: {
            ...state.trip.data,
            services: action.payload.tripServices,
            duration: action.payload.duration,
            notes: action.payload.notes,
          },
        },
      };
    case actions.types.TEMPORAL_REARRANGE:
      return {
        ...state,
        trip: {
          ...state.trip,
          data: {
            ...state.trip.data,
            services: action.payload.services,
          },
        },
      };
    case actions.types.SELECT_SERVICE_OPTION_SUCCESS:
    case actions.types.REMOVE_SERVICES_SUCCESS:
    case actions.types.SERVICE_MOVE_SUCCESS:
      return {
        ...state,
        trip: {
          ...state.trip,
          data: action.payload,
        },
      };
    case actions.types.FETCH_TAGS_SUCCESS:
      return {
        ...state,
        suggestedTags: action.payload,
      };
    case actions.types.UPDATE_MEDIA_START:
    case actions.types.UPDATE_MEDIA_SUCCESS:
    case actions.types.UPDATE_MEDIA_ERROR:
      return {
        ...state,
        trip: {
          ...state.trip,
          data: {
            ...state.trip.data,
            media: action.payload,
          },
        },
      };
    default:
      return state;
  }
}
