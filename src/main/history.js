import { createBrowserHistory, createLocation } from 'history';

const browserHistory = createBrowserHistory({
  /* pass a configuration object here if needed */
});

const createNewFn = target => (to, state, ...args) => {
  if (!state && typeof to !== 'object') {
    return target(to, state, ...args);
  }

  const obj =
    typeof to === 'object'
      ? to
      : {
          pathname: to.split('?', 2)[0],
          state: state,
          search: to.split('?', 2)[1] || '',
        };

  return target(createLocation(obj));
};

const previousPush = browserHistory.push;
const previousReplace = browserHistory.replace;

browserHistory.push = createNewFn(previousPush);
browserHistory.replace = createNewFn(previousReplace);

export default browserHistory;
