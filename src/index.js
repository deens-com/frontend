import React from 'react';
import ReactDOM from 'react-dom';
import App from './main/app';
import { createBrowserHistory as createHistory } from 'history';
//import { unregister as unregisterServiceWorker } from './registerServiceWorker';
import { isProd, isStaging } from './libs/config';

const history = createHistory();

import(/* webpackChunkName: "lazyloading" */ './main/lazyload');
import(/* webpackChunkName: "external-stuff" */ './main/external');

import(/* webpackChunkName: "sentry" */ '@sentry/browser').then(Sentry => {
  if (isProd || isStaging) {
    let environment = window.location.hostname.split('.')[0];
    if (environment !== 'localhost') {
      if (isProd) {
        environment = 'production';
        Sentry.init({
          dsn: 'https://f9fde204a5e449f19e907d9042dd04c8@sentry.io/1435541',
          environment,
        });
      } else {
        // staging
        Sentry.init({
          dsn: 'https://fd51482cf40f43fca379bc14417b6f2b@sentry.io/1220761',
          environment,
        });
      }
    }
  }

  if (isProd) {
    const noop = () => {};
    const error = errorMsg =>
      Sentry.addBreadcrumb({
        category: 'printed-error',
        message: `${errorMsg}`,
        level: Sentry.Severity.Error,
      });
    console.log = noop;
    console.warn = noop;
    console.error = error;
  }
});

const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement);
} else {
  ReactDOM.render(<App />, rootElement);
}
//unregisterServiceWorker();

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
