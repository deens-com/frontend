const initialState = {
  user_profile: {},
  planned_trips: [],
  completed_trips: [],
  metamaskError: {},
  ledger_error: {}
};

export default function AccountReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'USER_PROFILE_FETCHED':
      return {
        ...state,
        user_profile: action.payload.user_profile,
      };
    case 'PLANNED_TRIPS_FETCHED':
      return {
        ...state,
        planned_trips: [...state.planned_trips, action.payload.planned_trips],
      };
    case 'COMPLETED_TRIPS_FETCHED':
      return {
        ...state,
        completed_trips: [...state.completed_trips, action.payload.completed_trips],
      };
    case 'METAMASK_ERROR':
      return {
        ...state,
        metaMaskError: action.payload,
      };
    case 'LEDGER_ERROR':
      return {
        ...state,
        ledger_error: action.payload
      }
    default:
      return state;
  }
}
