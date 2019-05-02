import actions from './actions';
import {
  asyncInitialState,
  actionStartState,
  actionSuccessState,
  actionErrorState,
} from 'store/utils';
import { getLastSearchParams } from 'libs/localStorage';

const initialData = [];

const initialState = {
  results: asyncInitialState(initialData),
  count: null,
  minPrice: null,
  maxPrice: null,
  tagsOptions: [],
  searchQuery: {
    type: 'trip',
    page: 1,
    ...getLastSearchParams(),
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
        //minPrice: initialState.minPrice,
        //maxPrice: initialState.maxPrice,
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
        minPrice: action.payload.minPrice,
        maxPrice: action.payload.maxPrice,
        tagsOptions: action.payload.tags,
      };
    case types.search.error:
      return {
        ...state,
        results: {
          ...state.results,
          ...actionErrorState(action, state.results, initialData),
        },
        count: initialState.count,
        minPrice: initialState.minPrice,
        maxPrice: initialState.maxPrice,
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
