import { shouldTrack } from 'libs/config';

const track = (...args) => {
  if (!shouldTrack) {
    return;
  }
  return window.analytics.track(...args);
};

const identify = (...args) => {
  if (!shouldTrack) {
    return;
  }
  return window.analytics.identify(...args);
};

const reset = (...args) => {
  if (!shouldTrack) {
    return;
  }
  return window.analytics.reset(...args);
};

const page = url => {
  if (!shouldTrack) {
    return;
  }
  return window.analytics.page(url);
};

export default {
  page,
  planning: {
    brief: {
      start: () => track('planning_brief_start'),
      complete: () => track('planning_brief_complete'),
    },
    /*checkout: {
      start: planningCheckoutStart,
      complete: planningCheckoutComplete,
    },*/
  },
  trip: {
    create: () => track('trip_create'),
    customize: () => track('trip_customize'),
    publish: () => track('trip_publish'),
    book: () => track('trip_book'),
    checkout: {
      start: () => track('trip_checkout_start'),
      complete: () => track('trip_checkout_complete'),
    },
  },
  user: {
    login: session => {
      identify(session._id, {
        email: session.email,
      });
      track('user_login');
    },
    new: session => {
      identify(session._id, {
        email: session.email,
      });
      track('user_new');
    },
    logout: reset,
  },
};
