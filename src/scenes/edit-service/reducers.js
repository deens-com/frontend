import { types as actionTypes } from './actions';

const initialState = {
  isLoading: false,
  service: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SERVICE_FETCH_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.SERVICE_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        service: action.payload,
      };
    case actionTypes.SERVICE_FETCH_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};
