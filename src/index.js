import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import App from './main/app';
import createHistory from 'history/createBrowserHistory';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';
import Parse from 'parse';
import Raven from 'raven-js';

Parse.initialize('myAppId');
const history = createHistory();

if (process.env.REACT_APP_NODE_ENV === 'production') {
  Raven.config('https://fd51482cf40f43fca379bc14417b6f2b@sentry.io/1220761').install();
  Parse.serverURL = process.env.REACT_APP_PARSE_SERVER_URL || 'https://api.please.com/parse';
} else if (process.env.REACT_APP_NODE_ENV === 'staging') {
  Raven.config('https://fd51482cf40f43fca379bc14417b6f2b@sentry.io/1220761').install();
  Parse.serverURL =
    process.env.REACT_APP_PARSE_SERVER_URL || 'https://staging-api.please.com/parse';
} else {
  Parse.serverURL = process.env.REACT_APP_PARSE_SERVER_URL || 'https://api.please.docker/parse';
}

if (process.env.NODE_ENV === 'production') {
  const noop = () => {};
  const error = error => Raven.captureException(error);
  console.log = noop;
  console.warn = error;
  console.error = error;
}

ReactDOM.render(<App />, document.getElementById('root'));
unregisterServiceWorker();

// Stolen from: https://stackoverflow.com/a/9870540/1115059
function getQueryStringValue(key) {
  return decodeURIComponent(
    history.location.search.replace(
      new RegExp(
        '^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[.+*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$',
        'i',
      ),
      '$1',
    ),
  );
}

const customerId = getQueryStringValue('customer_id');
if (customerId && window.analytics) {
  window.analytics.identify(customerId);
}
