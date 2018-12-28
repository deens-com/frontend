function addNumberToRepeatedString(str) {
  const splitted = str.split('-');

  if (splitted[1]) {
    return `${splitted[0]}-${Number(splitted[1]) + 1}`;
  }

  return `${splitted[0]}-1`;
}

export const defaultState = {
  isLoading: true,
  data: null,
  error: null,
  timestamp: '0',
};

export default function(setState, stateKey, fn) {
  return function(...args) {
    let timestamp;
    setState(prevState => {
      timestamp = String(new Date().valueOf());

      if (timestamp === prevState[stateKey].timestamp) {
        // This should never happen in practice but I prefer to prevent
        timestamp = addNumberToRepeatedString(timestamp);
      }

      return {
        [stateKey]: {
          timestamp,
          isLoading: true,
          data: null,
          error: null,
        },
      };
    });

    const promise = fn(...args);

    promise
      .then(function(response) {
        setState(prevState => {
          if (prevState[stateKey].timestamp !== timestamp) {
            return;
          }

          return {
            [stateKey]: {
              isLoading: false,
              data: response.data,
            },
          };
        });
      })
      .catch(function(response) {
        setState(prevState => {
          if (prevState[stateKey].timestamp !== timestamp) {
            return;
          }

          return {
            [stateKey]: {
              isLoading: false,
              error: response.error,
            },
          };
        });
      });

    return promise;
  };
}
