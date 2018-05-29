import { types as actionTypes } from './actions';

const initialState = {
  isSubmitting: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SERVICE_CREATE_STARTED:
      return {
        ...state,
        isSubmitting: true,
      };
    case actionTypes.SERVICE_CREATE_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
        service: action.payload,
      };
    case actionTypes.SERVICE_CREATE_ERROR:
      return {
        ...state,
        error: action.payload,
        isSubmitting: false,
      };
    default:
      return state;
  }
};
