import { dismissGDPRBanner } from 'libs/cookies';

export const types = {
  DISMISS_GDPR: 'DISMISS_GDPR',
  RENDERED_GDPR: 'RENDERED_GDPR',
  SHOW_GDPR: 'SHOW_GDPR',
};

export const dismissGdpr = () => {
  return dispatch => {
    dismissGDPRBanner();

    dispatch({
      type: types.DISMISS_GDPR,
    });
  };
};

export const showGdpr = saveCookie => {
  return dispatch => {
    dispatch({
      type: types.SHOW_GDPR,
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
