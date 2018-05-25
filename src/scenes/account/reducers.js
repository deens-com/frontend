import {uniqEs6} from './../../libs/Utils';

const initialState = {
  user_profile: {},
  planned_trips: [],
  completed_trips: [],
  unscheduled_trips: [],
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
      const planned_trips = [...state.planned_trips, action.payload.planned_trips];
      const uniq_planned_trips = uniqEs6(planned_trips);
      return {
        ...state,
        planned_trips: uniq_planned_trips
      };
    case 'COMPLETED_TRIPS_FETCHED':
      const completed_trips = [...state.completed_trips, action.payload.completed_trips];
      const uniq_completed_trips = uniqEs6(completed_trips);
      return {
        ...state,
        completed_trips: uniq_completed_trips,
      };
    case 'UNSCHEDULED_TRIPS_FETCHED':
      return {
        ...state,
        unscheduled_trips: [...state.unscheduled_trips, action.payload.unscheduled_trips]
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
    default:
      return state;
  }
}
