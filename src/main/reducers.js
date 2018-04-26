import { combineReducers } from "redux";
import HomeReducer from "../scenes/home/reducers";
import SessionsReducer from "../scenes/sessions/reducers";
import RegistrationsReducer from "../scenes/registrations/reducers";
import ResultsReducer from "../scenes/results/reducers";
import TripsReducer from "../scenes/trips/reducers";
import ServicesReducer from "../scenes/services/reducers";
import UsersReducer from "../scenes/users/reducers";

const allReducers = combineReducers({
  HomeReducer,
  SessionsReducer,
  RegistrationsReducer,
  ResultsReducer,
  TripsReducer,
  ServicesReducer,
  UsersReducer
});

export default allReducers;
