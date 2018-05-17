import * as sessions_actions from "./actions";

const initialState = {
  session: {},
  loginError: {},
  metaMaskError: {},
  ledgerError: {},
  baseCurrency: {label: "$", value: "USD"}
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
    case sessions_actions.types.BASE_CURRENCY_SET:
      return {
        ...state,
        baseCurrency: action.payload.baseCurrency
      }
    default:
      return state;
  }
}
