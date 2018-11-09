import { types as actions } from './actions';

const initialState = {
  kyc_token: false,
  loading: false,
  error: null,
};

export default function TokenSaleReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.KYC_TOKEN_START:
      return {
        ...state,
        kyc_token: action.payload,
        loading: true,
      };
    case actions.KYC_TOKEN_SUCCESS:
      return {
        ...state,
        kyc_token: action.payload,
        loading: false,
      };
    case actions.KYC_TOKEN_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
