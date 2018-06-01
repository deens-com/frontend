import fetch_helpers from './../../libs/fetch_helpers';

const initialState = {
  user_profile: {},
  planned_trips: [],
  completed_trips: [],
  unscheduled_trips: [],
  user_services: [],
  metamaskError: {},
  ledger_error: {},
  editUserError: {}
};

export default function AccountReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'USER_PROFILE_FETCHED':
      return {
        ...state,
        user_profile: action.payload.user_profile,
      };
    case 'USER_SERVICES_FETCHED':
      return {
        ...state,
        user_services: action.payload.user_services,
      };
    case 'PLANNED_TRIPS_FETCHED':
      const planned_trips = [...state.planned_trips, action.payload.planned_trips];
      const uniq_planned_trips = fetch_helpers.removeDuplicates(planned_trips, 'objectId');
      return {
        ...state,
        planned_trips: uniq_planned_trips
      };
    case 'COMPLETED_TRIPS_FETCHED':
      const completed_trips = [...state.completed_trips, action.payload.completed_trips];
      const uniq_completed_trips = fetch_helpers.removeDuplicates(completed_trips, 'objectId');
      return {
        ...state,
        completed_trips: uniq_completed_trips,
      };
    case 'UNSCHEDULED_TRIPS_FETCHED':
      const unscheduled_trips = [...state.unscheduled_trips, action.payload.unscheduled_trips];
      const uniq_unscheduled_trips = fetch_helpers.removeDuplicates(unscheduled_trips, 'objectId');
      return {
        ...state,
        unscheduled_trips: uniq_unscheduled_trips
      }
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
    case 'EDIT_USER_ERROR_SET':
      return {
        ...state,
        editUserError: action.payload
      }
    default:
      return state;
  }
}
