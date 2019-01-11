import { types as actionTypes } from './actions';

// We should remove this actions/reducer and handle that in the component

const initialState = {
  isLoading: false,
  isSubmitting: false,
  service: null,
  error: {},
  serviceFormTagsOptions: [],
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
        isLoading: false,
      };
    case actionTypes.SERVICE_SAVE_STARTED:
      return {
        ...state,
        isSubmitting: true,
      };
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
    case actionTypes.SERVICE_SAVE_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
      };
    case actionTypes.SERVICE_FETCH_ERROR:
    case actionTypes.SERVICE_SAVE_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case actionTypes.TOGGLE_SUBMITTING_STATE:
      return {
        ...state,
        isSubmitting: action.payload,
      };
    case actionTypes.SERVICE_FORM_TAGS_FETCHED:
      return {
        ...state,
        serviceFormTagsOptions: action.payload,
      };
    default:
      return state;
  }
};
