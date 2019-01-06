import { dismissGDPRBanner } from 'libs/feature-flags';

export const types = {
  DISMISS_GDPR: 'DISMISS_GDPR',
  RENDERED_GDPR: 'RENDERED_GDPR',
};

export const dismissGdpr = () => {
  return dispatch => {
    dismissGDPRBanner();
    dispatch({
      type: types.DISMISS_GDPR,
    });
  };
};

export const renderedGdpr = height => {
  return dispatch => {
    dispatch({
      type: types.RENDERED_GDPR,
      payload: height,
    });
  };
};
