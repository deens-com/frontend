const initialState = {
  user_profile: {},
  all_trips: [],
  planned_trips: [],
  completed_trips: [],
  user_services: [],
  metamaskError: {},
  ledger_error: {},
  editUserError: {},
  failedReservations: [],
  isLoadingTrips: false,
};

export default function AccountReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'account/USER_PROFILE_FETCHED':
      return {
        ...state,
        user_profile: action.payload.user_profile,
      };
    case 'USER_SERVICES_FETCHED':
      return {
        ...state,
        user_services: action.payload.user_services,
      };
    case 'ACCOUNT/CATEGORIZED_TRIPS_FETCH_STARTED':
      return {
        ...state,
        isLoadingTrips: true,
      };
    case 'ACCOUNT/CATEGORIZED_TRIPS_FETCHED': {
      return {
        ...state,
        ...action.payload,
        isLoadingTrips: false,
      };
    }
    case 'METAMASK_ERROR':
      return {
        ...state,
        metaMaskError: action.payload,
      };
    case 'LEDGER_ERROR':
      return {
        ...state,
        ledger_error: action.payload,
      };
    case 'EDIT_USER_ERROR_SET':
      return {
        ...state,
        editUserError: action.payload,
      };
    case 'USER_FAILED_RESERVATIONS':
      return {
        ...state,
        failedReservations: action.payload,
      };
    default:
      return state;
  }
}
