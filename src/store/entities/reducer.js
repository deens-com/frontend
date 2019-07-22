import tripDesignerActions from 'store/trip-designer/actions';

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
    default:
      return state;
  }
}
