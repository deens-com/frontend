import actions from './actions';
import {
  asyncInitialState,
  actionStartState,
  actionSuccessState,
  actionErrorState,
} from 'store/utils';

const initialState = {
  results: asyncInitialState([]),
  count: null,
  tagsOptions: [],
  searchQuery: {
    type: [],
    tags: [],
    page: 1,
    sortBy: '',
  },
};

const types = actions.types;

export default function search(state = initialState, action = {}) {
  switch (action.type) {
    case types.search.start:
      return {
        ...state,
        results: {
          ...state.results,
          ...actionStartState(action, initialState.results.data),
        },
        count: initialState.count,
        tagsOptions: initialState.tagsOptions,
      };
    case types.search.success:
      return {
        ...state,
        results: {
          ...state.results,
          ...actionSuccessState(
            {
              ...action,
              payload: action.payload.results,
            },
            state.results,
          ),
        },
        count: action.payload.count,
        tagsOptions: action.payload.tags,
      };
    case types.search.error:
      return {
        ...state,
        results: {
          ...state.results,
          ...actionErrorState(action, state.results, initialState.results),
        },
        count: initialState.count,
        tagsOptions: initialState.tagsOptions,
        error: action.error,
      };
    case types.updateQueryParams:
      return {
        ...state,
        searchQuery: action.payload,
      };
    case types.patchQueryParams:
      return {
        ...state,
        searchQuery: {
          ...state.searchQuery,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}
