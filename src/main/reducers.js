import { combineReducers } from 'redux';
import search from 'store/search/reducer';
import services from 'store/services/reducer';
import trips from 'store/trips/reducer';
import settings from 'store/settings/reducer';
import servicesUpsert from 'store/services-upsert/reducer';
import checkout from 'store/checkout/reducer';
import AccountReducer from '../scenes/account/reducers';
import SessionsReducer from '../scenes/sessions/reducers';

const allReducers = combineReducers({
  search,
  trips,
  services,
  settings,
  servicesUpsert,
  checkout,
  SessionsReducer,
  AccountReducer,
});

export default allReducers;
