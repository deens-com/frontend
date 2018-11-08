import { types as actions } from './actions';

const initialState = {
  kyc_token: false,
};

export default function TokenSaleReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.KYC_TOKEN_SUCCESS:
      return {
        ...state,
        kyc_token: action.payload,
      };
    default:
      return state;
  }
}
