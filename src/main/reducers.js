import { combineReducers } from 'redux';
import HomeReducer from '../scenes/home/reducers';
import AccountReducer from '../scenes/account/reducers';
import SessionsReducer from '../scenes/sessions/reducers';
import RegistrationsReducer from '../scenes/registrations/reducers';
import ResultsReducer from '../scenes/results/reducers';
import TripsReducer from '../scenes/trips/reducers';
import ServicesReducer from '../scenes/services/reducers';
import UsersReducer from '../scenes/users/reducers';
import NewService from '../scenes/new-service/reducers';
import EditService from '../scenes/edit-service/reducers';

const allReducers = combineReducers({
  HomeReducer,
  SessionsReducer,
  RegistrationsReducer,
  ResultsReducer,
  TripsReducer,
  ServicesReducer,
  UsersReducer,
  AccountReducer,
  NewService,
  EditService,
});

export default allReducers;
