// Reducers helper functions

export const asyncInitialState = defaultData => ({
  isLoading: false,
  data: defaultData || [],
  timestamp: null,
});

export const actionStartState = (action, initialDataState) => ({
  isLoading: true,
  data: initialDataState,
  timestamp: action.timestamp,
});

export const actionSuccessState = (action, currentState) => {
  if (action.timestamp !== currentState.timestamp) {
    return null;
  }

  return {
    isLoading: false,
    data: action.payload,
    timestamp: action.timestamp,
  };
};

export const actionErrorState = (action, currentState, initialDataState) => {
  if (action.timestamp !== currentState.timestamp) {
    return null;
  }

  return {
    isLoading: false,
    data: initialDataState,
    timestamp: action.timestamp,
  };
};

// Actions helper functions

export const createAsyncActions = actionName => ({
  start: `${actionName}_START`,
  success: `${actionName}_SUCCESS`,
  error: `${actionName}_ERROR`,
});

export function makeActionCreator(type, ...argNames) {
  return function(...args) {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
}

// Returns 3 action creators in the following order: start, success, error.
function makeAsyncActionCreators(type) {
  const actions = createAsyncActions(type);
  return [
    function(timestamp) {
      return {
        type: actions.start,
        timestamp,
      };
    },
    function(data, timestamp) {
      return {
        type: actions.success,
        payload: data,
        timestamp,
      };
    },
    function(error, timestamp) {
      return {
        type: actions.error,
        error,
        timestamp,
      };
    },
  ];
}

export function dispatchAsyncActions(type, fn) {
  const actions = makeAsyncActionCreators(type);

  return async dispatch => {
    const timestamp = new Date().getTime();

    try {
      dispatch(actions[0](timestamp)); // Start
      const res = await fn();
      dispatch(actions[1](res, timestamp)); // Success
    } catch (e) {
      const errorAction = actions[2](e, timestamp);
      console.error(`Error in ${errorAction.type}`, e);

      dispatch(errorAction); // Error
    }
  };
}
