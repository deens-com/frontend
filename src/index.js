import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import App from './main/app';
import createHistory from 'history/createBrowserHistory';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';
import * as Sentry from '@sentry/browser';
import { isProd, isStaging } from './libs/config';
import * as featureFlags from './libs/feature-flags';
import { readSession } from 'libs/user-session';

const history = createHistory();

if (isProd || isStaging) {
  let environment = window.location.hostname.split('.')[0];

  if (environment !== 'localhost') {
    if (isProd) {
      environment = 'production';
    }

    Sentry.init({
      dsn: 'https://fd51482cf40f43fca379bc14417b6f2b@sentry.io/1220761',
      environment,
    });
  }
}

if (isProd) {
  const noop = () => {};
  const error = error => Sentry.captureException(error);
  console.log = noop;
  console.warn = error;
  console.error = error;
}

// reads localStorage to get the user object on load
readSession();

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

// reads localStorage to get the user object on load
readSession();

// for easier access to feature flag functions
window.featureFlags = featureFlags;
