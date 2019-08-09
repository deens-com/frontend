import tripDesignerActions from 'store/trip-designer/actions';
import searchActions from 'store/search/actions';
import { normalize } from 'normalizr';
import { tag as tagEntity } from 'libs/entities';

const searchTypes = searchActions.types;

const initialState = {
  services: {},
  tags: {},
  inDayServices: {}, // should this be here?
  availabilities: {},
  selectedOptions: {},
};

export default function entities(state = initialState, action = {}) {
  switch (action.type) {
    case tripDesignerActions.types.FETCH_TRIP_SUCCESS:
    case tripDesignerActions.types.UPDATE_TRIP_ENTITIES:
      return {
        ...state,
        services: {
          ...state.services,
          ...action.payload.entities.services,
        },
        tags: {
          ...state.tags,
          ...action.payload.entities.tags,
        },
        inDayServices: {
          ...state.inDayServices,
          ...action.payload.entities.inDayServices,
        },
        selectedOptions: {
          ...state.selectedOptions,
          ...action.payload.entities.selectedOptions,
        },
      };
    case tripDesignerActions.types.REMOVE_SERVICES_START:
      return {
        ...state,
        inDayServices: {
          ...Object.entries(state.inDayServices).reduce((prev, [key, value]) => {
            if (!action.payload.includes(key)) {
              return {
                ...prev,
                [key]: value,
              };
            }
            return prev;
          }, {}),
        },
      };
    case tripDesignerActions.types.REMOVE_DAY_START:
      return {
        ...state,
        inDayServices: {
          ...state.inDayServices,
          ...Object.entries(action.payload.inDayServices).reduce(
            (prev, [key, value]) => ({
              ...prev,
              [key]: value,
            }),
            {},
          ),
        },
      };
    case tripDesignerActions.types.ADD_CUSTOM_SERVICE_START:
      return {
        ...state,
        services: {
          ...state.services,
          [action.payload._id]: action.payload,
        },
      };
    case tripDesignerActions.types.ADD_CUSTOM_SERVICE_SUCCESS:
      return {
        ...state,
        inDayServices: {
          ...state.inDayServices,
          [action.payload.newServiceOrganization._id]: action.payload.newServiceOrganization,
        },
      };
    case tripDesignerActions.types.MODIFY_CUSTOM_SERVICE:
      return {
        ...state,
        services: {
          ...state.services,
          [action.payload.id]: {
            ...state.services[action.payload.id],
            ...action.payload.data,
          },
        },
      };
    case tripDesignerActions.types.MARK_AS_BOOKED:
      return {
        ...state,
        inDayServices: {
          ...state.inDayServices,
          [action.payload.id]: {
            ...state.services[action.payload.id],
            externallyBooked: action.payload.status,
          },
        },
      };
    case searchTypes.search.success:
      if (action.payload.type === 'trip') {
        return state;
      }
      return {
        ...state,
        tags: {
          ...state.tags,
          ...normalize(action.payload.tags, [tagEntity]).entities.tags,
        },
        amenities: {
          ...state.amenities,
          ...normalize(action.payload.amenities, [tagEntity]).entities.tags,
        },
      };
    default:
      return state;
  }
}
