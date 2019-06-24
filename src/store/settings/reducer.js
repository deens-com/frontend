import { types } from './actions';
// import { isGDPRDismissed } from 'libs/cookies';

const initialState = {
  gdprDismissed: true, //isGDPRDismissed(),
  gdprHeight: 0,
};

export default function settings(state = initialState, action = {}) {
  switch (action.type) {
    case types.DISMISS_GDPR: {
      return {
        ...state,
        gdprDismissed: true,
        gdprHeight: 0,
      };
    }
    case types.RENDERED_GDPR: {
      return {
        ...state,
        gdprHeight: action.payload,
      };
    }
    default:
      return state;
  }
}
