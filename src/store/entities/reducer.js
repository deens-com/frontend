import tripDesignerActions from 'store/trip-designer/actions';

const initialState = {
  services: {},
  tags: {},
  inDayServices: {}, // should this be here?
  availabilities: {},
};

export default function entities(state = initialState, action = {}) {
  switch (action.type) {
    case tripDesignerActions.types.FETCH_TRIP_SUCCESS:
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
          ...state.tags,
          ...action.payload.entities.inDayServices,
        },
      };
    default:
      return state;
  }
}
