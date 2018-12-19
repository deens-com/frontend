import { types } from './actions';
import {
  asyncInitialState,
  actionStartState,
  actionSuccessState,
  actionErrorState,
} from '../utils';

const initialState = {
  trips: asyncInitialState(),
};

export default function search(state = initialState, action = {}) {
  switch (action.type) {
    case types.searchTrips.start:
      return {
        ...state,
        trips: {
          ...state.trips,
          ...actionStartState(action, initialState.trips.data),
        },
      };
    case types.searchTrips.success:
      return {
        ...state,
        trips: {
          ...state.trips,
          ...actionSuccessState(action, state.trips),
        },
      };
    case types.searchTrips.error:
      return {
        ...state,
        trips: {
          ...state.trips,
          ...actionErrorState(action, state.trips, initialState.trips),
        },
      };
    default:
      return state;
  }
}
