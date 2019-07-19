import { combineReducers } from 'redux';
import search from 'store/search/reducer';
import services from 'store/services/reducer';
import trips from 'store/trips/reducer';
import settings from 'store/settings/reducer';
import servicesUpsert from 'store/services-upsert/reducer';
import checkout from 'store/checkout/reducer';
import account from 'store/account/reducer';
import session from 'store/session/reducer';
import header from 'store/header/reducer';
import tripDesigner from 'store/trip-designer/reducer';
import entities from 'store/entities/reducer';

const allReducers = combineReducers({
  search,
  trips,
  services,
  settings,
  servicesUpsert,
  checkout,
  session,
  account,
  header,
  tripDesigner,
  entities,
});

export default allReducers;
