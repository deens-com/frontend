import { types as actions} from './actions';

const initialState = {
  user_profile: {},
  allTrips: [],
  isLoadingTrips: false,
  user_services: [],
  isLoadingServices: false,
  metamaskError: {},
  ledger_error: {},
  editUserError: {},
  failedReservations: [],
};

export default function AccountReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'account/USER_PROFILE_FETCHED':
      return {
        ...state,
        user_profile: action.payload.user_profile,
      };
    case actions.SERVICES_FETCH_START:
      return {
        ...state,
        user_services: [],
        isLoadingServices: true,
      };
    case actions.SERVICES_FETCH_SUCCESS:
      return {
        ...state,
        user_services: action.payload,
        isLoadingServices: false,
      };
    case 'ACCOUNT/MY_TRIPS_FETCH_STARTED':
      return {
        ...state,
        isLoadingTrips: true,
      };
    case 'ACCOUNT/MY_TRIPS_FETCHED': {
      return {
        ...state,
        allTrips: action.payload,
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
