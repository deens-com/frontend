import React, { Suspense } from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import withErrorBoundary from './middlewares/WithErrorBoundary';
import Home from './../scenes/home/home';

import Notfound from './../styled_scenes/NotFound';
import ScrollToTop from './middlewares/ScrollToTop';

import PrivateRoute from './PrivateRoute';
import OnlyPublicRoute from './OnlyPublicRoute';
import withSegmentTracker from './middlewares/with_segment_tracker';
import LoadingDots from 'shared_components/LoadingDots';

const commonHOCs = comp => withErrorBoundary(withSegmentTracker(comp));
const WaitForComponent = Component => {
  return props => (
    <Suspense fallback={<LoadingDots />}>
      <Component {...props} />
    </Suspense>
  );
};
const asyncCommonHOCs = Component => commonHOCs(WaitForComponent(Component));

const Sessions = React.lazy(() => import('./../scenes/sessions/sessions'));
const UserVerification = React.lazy(() => import('../scenes/user-verification'));
const Registrations = React.lazy(() => import('./../scenes/registrations/registrations'));
const RecoverPassword = React.lazy(() => import('./../scenes/recover-password'));
const EarnMoney = React.lazy(() => import('./../scenes/earn-money'));
const TokenSale = React.lazy(() => import('./../scenes/token-sale'));
const CookiePolicy = React.lazy(() => import('./../scenes/cookie-policy'));
const SearchResults = React.lazy(() => import('./../scenes/results/results'));
const ServiceUpsert = React.lazy(() => import('../scenes/service-upsert'));
const Services = React.lazy(() => import('./../scenes/services/services'));
const TripOrganizer = React.lazy(() => import('./../scenes/trip-organizer'));
const TripShare = React.lazy(() => import('./../scenes/trip-share'));
const Checkout = React.lazy(() => import('../scenes/checkout'));
const TripCreator = React.lazy(() => import('./../scenes/trip-creator'));
const Trips = React.lazy(() => import('./../scenes/trip'));
const Users = React.lazy(() => import('./../scenes/users/users'));
const Account = React.lazy(() => import('./../scenes/account/account'));
const Blog = React.lazy(() => import('../scenes/blog'));

export default (
  <ScrollToTop>
    <Switch>
      <Route exact path={process.env.PUBLIC_URL + '/'} component={commonHOCs(Home)} />
      <OnlyPublicRoute
        path={process.env.PUBLIC_URL + '/login'}
        component={asyncCommonHOCs(Sessions)}
      />
      <Route
        path={process.env.PUBLIC_URL + '/user-verification'}
        component={asyncCommonHOCs(UserVerification)}
      />
      <OnlyPublicRoute
        path={process.env.PUBLIC_URL + '/register'}
        component={asyncCommonHOCs(Registrations)}
      />
      <OnlyPublicRoute
        path={process.env.PUBLIC_URL + '/recover-password'}
        component={asyncCommonHOCs(RecoverPassword)}
      />
      <Route path={process.env.PUBLIC_URL + '/earn-money'} component={asyncCommonHOCs(EarnMoney)} />
      <Route path={process.env.PUBLIC_URL + '/token-sale'} component={asyncCommonHOCs(TokenSale)} />
      <Route
        path={process.env.PUBLIC_URL + '/token-sale/smart-contract'}
        component={asyncCommonHOCs(TokenSale)}
      />
      <Route
        path={process.env.PUBLIC_URL + '/cookie-policy'}
        component={asyncCommonHOCs(CookiePolicy)}
      />
      <Route
        path={process.env.PUBLIC_URL + '/results'}
        component={asyncCommonHOCs(SearchResults)}
      />
      <PrivateRoute
        path={process.env.PUBLIC_URL + '/services/new'}
        component={asyncCommonHOCs(ServiceUpsert)}
      />
      <PrivateRoute
        path={process.env.PUBLIC_URL + '/services/edit/:id'}
        component={asyncCommonHOCs(ServiceUpsert)}
      />
      <Route
        path={process.env.PUBLIC_URL + '/services/:slug?_:id'}
        component={asyncCommonHOCs(Services)}
      />
      <Route
        path={process.env.PUBLIC_URL + '/trips/organize/:id'}
        component={asyncCommonHOCs(TripOrganizer)}
        message="Please login or register to continue with your trip."
      />
      <Route
        path={process.env.PUBLIC_URL + '/trips/organize'}
        component={asyncCommonHOCs(TripOrganizer)}
      />
      <PrivateRoute
        path={process.env.PUBLIC_URL + '/trips/share/:id'}
        component={asyncCommonHOCs(TripShare)}
        message="Please login or register to share your trip."
      />
      <Route
        path={process.env.PUBLIC_URL + '/trips/checkout/:id'}
        component={asyncCommonHOCs(Checkout)}
      />
      <Route
        path={process.env.PUBLIC_URL + '/trips/create'}
        component={asyncCommonHOCs(TripCreator)}
      />
      <Route
        path={process.env.PUBLIC_URL + '/trips/:slug?_:id'}
        component={asyncCommonHOCs(Trips)}
      />
      <Route
        path={process.env.PUBLIC_URL + '/users/:userName'}
        component={asyncCommonHOCs(Users)}
      />
      <Route path={process.env.PUBLIC_URL + '/account'} component={asyncCommonHOCs(Account)} />
      <Route path={process.env.PUBLIC_URL + '/:slug'} component={asyncCommonHOCs(Blog)} />
      <Route component={withErrorBoundary(Notfound)} />
    </Switch>
  </ScrollToTop>
);
