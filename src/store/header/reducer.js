import actions from './actions';

const initialState = {
  transparent: false,
  noSearch: false,
};

const types = actions.types;

export default function header(state = initialState, action = {}) {
  switch (action.type) {
    case types.CHANGE_HEADER:
      return {
        ...initialState,
        ...action.payload,
      };
    default:
      return state;
  }
}
