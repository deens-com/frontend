const initialState = {
  services: []
}

export default function homeReducer(state = initialState, action={}) {
  switch(action.type) {
    case 'SERVICES_FETCHED':
      return {
        ...state,
        services: action.payload.services
      }
    default:
      return state
  }
}
