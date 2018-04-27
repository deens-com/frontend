import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
import allReducers from './reducers';
import { createTracker } from 'redux-segment';

const tracker = createTracker();

const middlewares = [thunk, tracker];

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
})

const store = createStore(allReducers, /* preloadedState, */ composeEnhancers(
  applyMiddleware(...middlewares),
  // other store enhancers if any
))

export default store
