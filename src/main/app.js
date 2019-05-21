import React from 'react';
import { Provider } from 'react-redux';
import queryString from 'query-string';
import Cookies from 'js-cookie';
import store from './store';
import history from 'main/history';
import { Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { getCurrentUser, getFavoriteTrips } from 'store/session/actions';
import GDPRNotification from './GDPRNotification';
import Routes from './router';
import Skeleton from './skeleton';
import 'semantic-ui-css/components/reset.min.css';
import 'semantic-ui-css/components/site.min.css';

class App extends React.Component {
  checkForReferrerAndSet = () => {
    const cookieReferrerId = 'deens_referrer_id';
    const params = queryString.parse(history.location.search);

    if (params.ref) {
      Cookies.set(cookieReferrerId, params.ref);
    }
  };

  componentDidMount() {
    getCurrentUser()(store.dispatch, store.getState).then(() => {
      getFavoriteTrips()(store.dispatch, store.getState);
    });
    this.checkForReferrerAndSet();
  }

  render() {
    return (
      <HelmetProvider>
        <Provider store={store}>
          <React.Fragment>
            <GDPRNotification />
            <Router history={history}>
              <Skeleton>{Routes}</Skeleton>
            </Router>
          </React.Fragment>
        </Provider>
      </HelmetProvider>
    );
  }
}

export default App;
