import { combineReducers } from 'redux';
import search from 'store/search/reducer';
import services from 'store/services/reducer';
import trips from 'store/trips/reducer';
import settings from 'store/settings/reducer';
import AccountReducer from '../scenes/account/reducers';
import SessionsReducer from '../scenes/sessions/reducers';
import servicesUpsert from '../scenes/service-upsert/reducers';
import CheckoutReducer from '../scenes/checkout/reducers';

const allReducers = combineReducers({
  search,
  trips,
  services,
  settings,
  SessionsReducer,
  AccountReducer,
  servicesUpsert,
  CheckoutReducer,
});

export default allReducers;
