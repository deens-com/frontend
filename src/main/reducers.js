import { combineReducers } from 'redux';
import search from '../store/search/reducer';
import services from 'store/services/reducer';
import trips from '../store/trips/reducer';
import AccountReducer from '../scenes/account/reducers';
import SessionsReducer from '../scenes/sessions/reducers';
import TripReducer from '../scenes/trip/reducers';
import UsersReducer from '../scenes/users/reducers';
import ServiceUpsert from '../scenes/service-upsert/reducers';
import CheckoutReducer from '../scenes/checkout/reducers';
import TokenSaleReducer from '../scenes/token-sale/reducers';
import SettingsReducer from './settings/reducers';

// const combineFlat = reducers => (state, action) =>
//   reducers.reduce((newState, reducer) => reducer(newState, action), state);

const allReducers = combineReducers({
  search,
  trips,
  services,
  SessionsReducer,
  TripReducer,
  UsersReducer,
  AccountReducer,
  ServiceUpsert,
  CheckoutReducer,
  TokenSaleReducer,
  SettingsReducer,
});

export default allReducers;
