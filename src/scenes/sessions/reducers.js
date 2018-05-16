import * as sessions_actions from "./actions";

const initialState = {
  session: {},
  loginError: {},
  metaMaskError: {},
  ledgerError: {}
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
    case sessions_actions.types.METAMASK_ERROR:
      return {
        ...state,
        metaMaskError: action.payload,
      }
    case sessions_actions.types.LEDGER_ERROR:
      return {
        ...state,
        ledgerError: action.payload,
      }
    default:
      return state;
  }
}
