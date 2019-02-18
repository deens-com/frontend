import React from 'react';
import { Provider } from 'react-redux';
import queryString from 'query-string';
import Cookies from 'js-cookie';
import store from './store';
import history from 'main/history';
import { Router } from 'react-router-dom';
import { getCurrentUser, getFavoriteTrips } from 'store/session/actions';
import GDPRNotification from './GDPRNotification';
import Routes from './router';
import Skeleton from './skeleton';

class App extends React.Component {
  checkForReferrerAndSet = () => {
    const cookieReferrerId = 'please_referrer_id';
    const params = queryString.parse(history.location.search);

    if (params.ref) {
      Cookies.set(cookieReferrerId, params.ref);
    }
  };

  componentDidMount() {
    getCurrentUser()(store.dispatch);
    getFavoriteTrips()(store.dispatch);
    this.checkForReferrerAndSet();
  }

  render() {
    return (
      <Provider store={store}>
        <React.Fragment>
          <GDPRNotification />
          <Router history={history}>
            <Skeleton>
              <Routes />
            </Skeleton>
          </Router>
        </React.Fragment>
      </Provider>
    );
  }
}

export default App;
