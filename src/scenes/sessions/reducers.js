import * as sessions_actions from './actions';

// set default base currency
let defaultBaseCurrency = { label: '$', value: 'USD', rates: {} };

if (typeof localStorage !== 'undefined' && localStorage.getItem('currency')) {
  defaultBaseCurrency = JSON.parse(localStorage.getItem('currency'));
}

const initialState = {
  session: {},
  loginError: {},
  metaMaskError: {},
  ledgerError: {},
  baseCurrency: defaultBaseCurrency,
  isLedgerLoaderDisplayed: false,
  updateError: {},
  isUploadingAvatar: false,
  loggedIn: null,
};

export default function SessionsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case sessions_actions.types.LOGIN_SUCCESS:
      return {
        ...state,
        session: action.payload.session,
        loggedIn: true,
        loginError: {},
      };
    case sessions_actions.types.LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload,
        loggedIn: false,
      };
    case sessions_actions.types.NOT_LOGGED_IN:
      return {
        ...state,
        session: {},
        loggedIn: false,
      };
    case sessions_actions.types.METAMASK_ERROR:
      return {
        ...state,
        metaMaskError: action.payload,
      };
    case sessions_actions.types.LEDGER_ERROR:
      return {
        ...state,
        ledgerError: action.payload,
      };
    case sessions_actions.types.UPDATE_ERROR:
      return {
        ...state,
        updateError: action.payload,
      };
    case sessions_actions.types.BASE_CURRENCY_SET:
      return {
        ...state,
        baseCurrency: action.payload.baseCurrency,
      };
    case sessions_actions.types.TOGGLE_LEDGER_LOADER_DISPLAY:
      return {
        ...state,
        isLedgerLoaderDisplayed: action.payload,
      };
    case sessions_actions.types.AVATAR_UPLOAD_START:
      return {
        ...state,
        isUploadingAvatar: true,
      };
    case sessions_actions.types.AVATAR_UPLOAD_FINISH:
      return {
        ...state,
        isUploadingAvatar: false,
      };
    default:
      return state;
  }
}
