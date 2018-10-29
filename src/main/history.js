/* To Read Article : https://medium.com/@pshrmn/a-little-bit-of-history-f245306f48dd */

//import { createBrowserHistory } from 'history'
// export default createBrowserHistory({
//   /* pass a configuration object here if needed */
// })

// Switching to HashHistory in order to get react-router to work
import { createHashHistory, createLocation } from 'history';

const hashHistory = createHashHistory({
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
          pathname: to,
          state: state,
        };

  return target(createLocation(obj));
};

const previousPush = hashHistory.push;
const previousReplace = hashHistory.replace;

hashHistory.push = createNewFn(previousPush);
hashHistory.replace = createNewFn(previousReplace);

export default hashHistory;
