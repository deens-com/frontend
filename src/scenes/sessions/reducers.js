import * as sessions_actions from './actions';

const initialState = {
  session: {}
};

export default function SessionsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case sessions_actions.types.SESSION_FETCHED:
      return {
        ...state,
        session: action.payload.session
      };
    default:
      return state;
  }
}
