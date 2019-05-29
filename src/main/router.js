import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import withErrorBoundary from './middlewares/WithErrorBoundary';

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

const Home = React.lazy(() =>
  import(/* webpackChunkName: "home", webpackPrefetch: 100 */ './../scenes/home/home'),
);
const Sessions = React.lazy(() =>
  import(/* webpackChunkName: "sessions" */ './../scenes/sessions/sessions'),
);
const UserVerification = React.lazy(() =>
  import(/* webpackChunkName: "user-verification" */ '../scenes/user-verification'),
);
const Registrations = React.lazy(() =>
  import(/* webpackChunkName: "registrations" */ './../scenes/registrations/registrations'),
);
const RecoverPassword = React.lazy(() =>
  import(/* webpackChunkName: "recover-password" */ './../scenes/recover-password'),
);
const EarnMoney = React.lazy(() =>
  import(/* webpackChunkName: "earn-money" */ './../scenes/earn-money'),
);
const TokenSale = React.lazy(() =>
  import(/* webpackChunkName: "token-sale" */ './../scenes/token-sale'),
);
const CookiePolicy = React.lazy(() =>
  import(/* webpackChunkName: "cookie-policy" */ './../scenes/cookie-policy'),
);
const SearchResults = React.lazy(() =>
  import(/* webpackChunkName: "results", webpackPrefetch: true */ './../scenes/results/results'),
);
const ServiceUpsert = React.lazy(() =>
  import(/* webpackChunkName: "service-upsert" */ '../scenes/service-upsert'),
);
const Services = React.lazy(() =>
  import(/* webpackChunkName: "services", webpackPrefetch: true */ './../scenes/services/services'),
);
const TripOrganizer = React.lazy(() =>
  import(/* webpackChunkName: "trip-organizer" */ './../scenes/trip-organizer'),
);
const TripShare = React.lazy(() =>
  import(/* webpackChunkName: "trip-share" */ './../scenes/trip-share'),
);
const Checkout = React.lazy(() => import(/* webpackChunkName: "checkout" */ '../scenes/checkout'));
const TripCreator = React.lazy(() =>
  import(/* webpackChunkName: "trip-creator" */ './../scenes/trip-creator'),
);
const Trips = React.lazy(() =>
  import(/* webpackChunkName: "trip", webpackPrefetch: true */ './../scenes/trip'),
);
const Users = React.lazy(() => import(/* webpackChunkName: "users" */ './../scenes/users/users'));
const Account = React.lazy(() =>
  import(/* webpackChunkName: "account" */ './../scenes/account/account'),
);
const Blog = React.lazy(() => import(/* webpackChunkName: "blog" */ '../scenes/blog'));
const Notfound = React.lazy(() =>
  import(/* webpackChunkName: "not-found" */ './../styled_scenes/NotFound'),
);

export default () => (
  <ScrollToTop>
    <Switch>
      <Route exact path={process.env.PUBLIC_URL + '/'} component={asyncCommonHOCs(Home)} />
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
      <Route
        path={process.env.PUBLIC_URL + '/404'}
        component={withErrorBoundary(WaitForComponent(Notfound))}
      />
      <Route path={process.env.PUBLIC_URL + '/:slug'} component={asyncCommonHOCs(Blog)} />
      <Route component={withErrorBoundary(WaitForComponent(Notfound))} />
    </Switch>
  </ScrollToTop>
);
