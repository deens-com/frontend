import { combineReducers } from 'redux'
import HomeReducer from '../scenes/home/reducers'
import SessionsReducer from '../scenes/sessions/reducers'
import RegistrationsReducer from '../scenes/registrations/reducers'

const allReducers = combineReducers({
  HomeReducer,
  SessionsReducer,
  RegistrationsReducer,
})

export default allReducers
