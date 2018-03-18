import * as sessions_actions from "./actions";

const initialState = {
  session: {},
  loginError: {}
};

export default function SessionsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case sessions_actions.types.LOGIN_SUCCESS:
      return {
        ...state,
        session: action.payload.session,
        loginError: {}
      };
    case sessions_actions.types.LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload
      };
    default:
      return state;
  }
}
