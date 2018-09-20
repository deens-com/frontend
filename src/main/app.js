import React from 'react';
import { Switch } from 'react-router';
import { Route, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import withSegmentTracker from './middlewares/with_segment_tracker';
import withErrorBoundary from './middlewares/WithErrorBoundary';
import Home from './../scenes/home/home';
import EarnMoney from './../scenes/earn-money';
import Account from './../scenes/account/account';
import Sessions from './../scenes/sessions/sessions';
import Results from './../scenes/results/results';
import Trips from './../scenes/trips/trips';
import Users from './../scenes/users/users';
import Services from './../scenes/services/services';
import Registrations from './../scenes/registrations/registrations';
import Notfound from './../styled_scenes/NotFound';
import ScrollToTop from './middlewares/ScrollToTop';
import ServiceUpsert from '../scenes/service-upsert';
import Checkout from '../scenes/checkout';

const commonHOCs = comp => withErrorBoundary(withSegmentTracker(comp));

const TripsWithSegment = commonHOCs(Trips);
// when the url param changes React Router doesn't unmount & remount the component
// instead it just changes the props
// by applying a key, React will unmount and remount the component on key change
const renderTrips = props => <TripsWithSegment {...props} key={props.location.pathname} />;

const App = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <ScrollToTop>
          <Switch>
            <Route exact path={process.env.PUBLIC_URL + '/'} component={commonHOCs(Home)} />
            <Route path={process.env.PUBLIC_URL + '/login'} component={commonHOCs(Sessions)} />
            <Route
              path={process.env.PUBLIC_URL + '/register'}
              component={commonHOCs(Registrations)}
            />
            <Route
              path={process.env.PUBLIC_URL + '/earn-money'}
              component={commonHOCs(EarnMoney)}
            />
            <Route path={process.env.PUBLIC_URL + '/results'} component={commonHOCs(Results)} />
            <Route
              path={process.env.PUBLIC_URL + '/services/new'}
              component={commonHOCs(ServiceUpsert)}
            />
            <Route
              path={process.env.PUBLIC_URL + '/services/edit/:id'}
              component={commonHOCs(ServiceUpsert)}
            />
            <Route
              path={process.env.PUBLIC_URL + '/services/:id'}
              component={commonHOCs(Services)}
            />
            <Route path={process.env.PUBLIC_URL + '/trips/:id'} render={renderTrips} />
            <Route
              path={process.env.PUBLIC_URL + '/checkout/:id'}
              component={commonHOCs(Checkout)}
            />
            <Route
              path={process.env.PUBLIC_URL + '/users/:userName'}
              component={commonHOCs(Users)}
            />
            <Route path={process.env.PUBLIC_URL + '/account'} component={commonHOCs(Account)} />
            <Route component={withErrorBoundary(Notfound)} />
          </Switch>
        </ScrollToTop>
      </HashRouter>
    </Provider>
  );
};

export default App;
