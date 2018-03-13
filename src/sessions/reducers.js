const initialState = {
  session: {}
}

export default function SessionsReducer(state = initialState, action={}) {
  switch(action.type) {
    case 'SESSION_FETCHED':
      return {
        ...state,
        session: action.payload.session
      }
    default:
      return state
  }
}
