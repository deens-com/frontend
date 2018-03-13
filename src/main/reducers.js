import { combineReducers } from 'redux'
import HomeReducer from '../home/reducers'
import SessionsReducer from '../sessions/reducers'
import RegistrationsReducer from '../registrations/reducers'

const allReducers = combineReducers({
  HomeReducer,
  SessionsReducer,
  RegistrationsReducer,
})

export default allReducers
