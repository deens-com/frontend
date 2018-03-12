import { combineReducers } from 'redux'
import SessionsReducer from '../sessions/reducers'
import RegistrationsReducer from '../registrations/reducers'

const allReducers = combineReducers({
  SessionsReducer,
  RegistrationsReducer,
})

export default allReducers
