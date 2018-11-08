import { dismissGDPRBanner } from 'libs/feature-flags';

export const types = {
  DISMISS_GDPR: 'DISMISS_GDPR',
};

export const dismissGdpr = () => {
  return dispatch => {
    dismissGDPRBanner();
    dispatch({
      type: types.DISMISS_GDPR,
    });
  };
};
