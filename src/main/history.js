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

const proxyObj = {
  apply: (target, thisArg, argumentList) => {
    if (!argumentList[1] && typeof argumentList[0] !== 'object') {
      return target(...argumentList);
    }

    const obj =
      typeof argumentList[0] === 'object'
        ? argumentList[0]
        : {
            pathname: argumentList[0],
            state: argumentList[1],
          };

    return target(createLocation(obj));
  },
};

hashHistory.push = new Proxy(hashHistory.push, proxyObj);

hashHistory.replace = new Proxy(hashHistory.replace, proxyObj);

export default hashHistory;
