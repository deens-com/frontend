import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import App from './main/app';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';
import Parse from 'parse';
import Raven from 'raven-js';

Parse.initialize('myAppId');
Parse.serverURL = 'https://api.please.docker/parse';

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://fd51482cf40f43fca379bc14417b6f2b@sentry.io/1220761').install();
  Parse.serverURL = process.env.REACT_APP_PARSE_SERVER_URL || 'https://please-api.herokuapp.com/parse';
}

ReactDOM.render(<App />, document.getElementById('root'));
unregisterServiceWorker();
