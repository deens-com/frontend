import { types } from './actions';
import { isGDPRDismissed } from 'libs/feature-flags';

const initialState = {
  gdprDismissed: isGDPRDismissed(),
};

export default function SettingsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.DISMISS_GDPR: {
      return {
        ...state,
        gdprDismissed: true,
      };
    }
    default:
      return state;
  }
}
